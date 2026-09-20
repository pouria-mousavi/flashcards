-- Additive migration: no legacy cards, deadlines, or progress rows are updated.
begin;

-- Older open app tabs may still call this endpoint. Preserve compatibility
-- without letting a page load move any legacy learning/review deadlines.
create or replace function public.sv_smooth_backlog(p_target integer default 25)
returns integer language sql stable set search_path = '' as $$ select 0 $$;

create table public.study_card_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  deck text not null check (deck in ('swedish','english','grammar')),
  card_id uuid not null,
  revision integer not null check (revision > 0),
  last_event_id uuid not null,
  fsrs jsonb not null,
  stats jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, deck, card_id)
);

create table public.study_review_events (
  user_id uuid not null references auth.users(id) on delete cascade,
  id uuid not null,
  deck text not null check (deck in ('swedish','english','grammar')),
  card_id uuid not null,
  reviewed_at timestamptz not null,
  rating integer not null check (rating in (0,3,4,5)),
  duration_ms integer not null check (duration_ms between 0 and 1200000),
  status text not null check (status in ('applied','conflict')),
  payload jsonb not null,
  received_at timestamptz not null default now(),
  primary key (user_id, id)
);
create index study_review_events_day on public.study_review_events(user_id, reviewed_at);

create table public.study_time_segments (
  user_id uuid not null references auth.users(id) on delete cascade,
  id uuid not null,
  studied_on date not null,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  check (ended_at >= started_at and ended_at - started_at <= interval '25 hours'),
  primary key (user_id, studied_on, id)
);

alter table public.study_card_state enable row level security;
alter table public.study_review_events enable row level security;
alter table public.study_time_segments enable row level security;
create policy study_state_read on public.study_card_state for select to authenticated
  using (user_id = auth.uid() and public.is_approved());
create policy study_events_read on public.study_review_events for select to authenticated
  using (user_id = auth.uid() and public.is_approved());
create policy study_time_read on public.study_time_segments for select to authenticated
  using (user_id = auth.uid() and public.is_approved());
revoke all on public.study_card_state, public.study_review_events, public.study_time_segments from anon, authenticated;
grant select on public.study_card_state, public.study_review_events, public.study_time_segments to authenticated;

create function public.record_study_review(p_event jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  eid uuid := (p_event->>'id')::uuid;
  cid uuid := (p_event->>'card_id')::uuid;
  deck_name text := p_event->>'deck';
  expected integer := (p_event->>'expected_revision')::integer;
  parent uuid := (p_event->>'parent_event_id')::uuid;
  current_state public.study_card_state;
  prior_event public.study_review_events;
  outcome text;
  is_valid_card boolean := false;
begin
  if uid is null or not public.is_approved() then raise exception 'Not authorized' using errcode = '42501'; end if;
  if eid is null or cid is null or expected is null or expected < 0
     or (p_event->>'rating')::integer not in (0,3,4,5)
     or p_event->>'algorithm' is distinct from 'ts-fsrs@5.4.2-retention-0.90'
     or jsonb_typeof(p_event->'after_stats') is distinct from 'object'
     or jsonb_typeof(p_event->'before_stats') is distinct from 'object'
     or jsonb_typeof(p_event->'fsrs_after') is distinct from 'object'
     or coalesce(p_event->'after_stats'->>'state','') not in ('NEW','LEARNING','REVIEW','RELEARNING')
     or coalesce((p_event->'after_stats'->>'nextReviewDate')::double precision,0) <= 0
     or coalesce((p_event->'fsrs_after'->>'stability')::double precision,0) <= 0
     or coalesce((p_event->'fsrs_after'->>'difficulty')::double precision,0) not between 1 and 10
     or coalesce((p_event->'fsrs_after'->>'state')::integer,-1) not between 0 and 3
     or (p_event->'fsrs_after'->>'due')::timestamptz is null
     or (p_event->'fsrs_after'->>'last_review')::timestamptz is null
  then raise exception 'Invalid review event' using errcode = '22023'; end if;

  if deck_name = 'swedish' then
    select exists(select 1 from public.swedish_cards where id=cid and not coalesce(retired,false)) into is_valid_card;
  elsif deck_name = 'english' and public.is_sv_admin() then
    select exists(select 1 from public.cards where id=cid) into is_valid_card;
  elsif deck_name = 'grammar' and public.is_sv_admin() then
    select exists(select 1 from public.grammar_cards where id=cid) into is_valid_card;
  end if;
  if not is_valid_card then raise exception 'Card unavailable' using errcode = '42501'; end if;

  -- One lock per user also serializes duplicate event IDs across different cards.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(uid::text, 0));
  select * into current_state from public.study_card_state where user_id=uid and deck=deck_name and card_id=cid;
  select * into prior_event from public.study_review_events where user_id=uid and id=eid;
  if found then
    if prior_event.payload <> p_event then raise exception 'Event ID already used' using errcode='22023'; end if;
    return jsonb_build_object('status', case when prior_event.status='conflict' then 'conflict' else 'duplicate' end, 'state', to_jsonb(current_state));
  end if;

  outcome := case when coalesce(current_state.revision,0)=expected
    and current_state.last_event_id is not distinct from parent then 'applied' else 'conflict' end;
  insert into public.study_review_events(user_id,id,deck,card_id,reviewed_at,rating,duration_ms,status,payload)
    values(uid,eid,deck_name,cid,(p_event->>'reviewed_at')::timestamptz,(p_event->>'rating')::integer,
      (p_event->>'duration_ms')::integer,outcome,p_event);
  if outcome='applied' then
    insert into public.study_card_state(user_id,deck,card_id,revision,last_event_id,fsrs,stats)
    values(uid,deck_name,cid,expected+1,eid,p_event->'fsrs_after',p_event->'after_stats')
    on conflict (user_id,deck,card_id) do update set
      revision=excluded.revision, last_event_id=excluded.last_event_id,
      fsrs=excluded.fsrs, stats=excluded.stats, updated_at=now()
    returning * into current_state;
  end if;
  return jsonb_build_object('status',outcome,'state',to_jsonb(current_state));
end;
$$;
revoke all on function public.record_study_review(jsonb) from public, anon;
grant execute on function public.record_study_review(jsonb) to authenticated;

create function public.sync_study_time(p_segments jsonb default '[]'::jsonb) returns setof public.study_time_segments
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  item jsonb;
  start_at timestamptz;
  end_at timestamptz;
  day date;
begin
  if uid is null or not public.is_approved() then raise exception 'Not authorized' using errcode='42501'; end if;
  if jsonb_typeof(p_segments) <> 'array' or jsonb_array_length(p_segments)>500 then
    raise exception 'Invalid time segments' using errcode='22023';
  end if;
  for item in select * from jsonb_array_elements(p_segments) loop
    start_at := (item->>'started_at')::timestamptz;
    end_at := (item->>'ended_at')::timestamptz;
    day := (item->>'studied_on')::date;
    if day is distinct from (start_at at time zone 'Europe/Stockholm')::date
      or end_at > ((day+1)::timestamp at time zone 'Europe/Stockholm')
      or end_at < start_at then raise exception 'Invalid time segment' using errcode='22023'; end if;
    insert into public.study_time_segments(user_id,id,studied_on,started_at,ended_at)
    values(uid,(item->>'id')::uuid,day,start_at,end_at)
    on conflict(user_id,studied_on,id) do update set
      started_at=least(study_time_segments.started_at,excluded.started_at),
      ended_at=greatest(study_time_segments.ended_at,excluded.ended_at);
  end loop;
  return query select * from public.study_time_segments where user_id=uid
    and studied_on >= (now() at time zone 'Europe/Stockholm')::date - 1;
end;
$$;
revoke all on function public.sync_study_time(jsonb) from public, anon;
grant execute on function public.sync_study_time(jsonb) to authenticated;

notify pgrst, 'reload schema';
commit;
