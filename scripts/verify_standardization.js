import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
const envContent = fs.readFileSync(envPath, "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length > 1) {
    let val = parts.slice(1).join("=").trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[parts[0].trim()] = val;
  }
});

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
);

async function verify() {
  // Check total cards
  const { count } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true });

  // Check updated cards (Hack: check if front has ===HINT=== or word_forms has other_meanings)
  // Note: 'like' query on front might be slow but okay for check
  const { count: updatedCount } = await supabase
    .from("cards")
    .select("*", { count: "exact", head: true })
    .like("front", "%===HINT===%");

  console.log(`Total Cards: ${count}`);
  console.log(`Updated Cards: ${updatedCount}`);

  // Sample a few updated cards
  const { data: samples } = await supabase
    .from("cards")
    .select("*")
    .like("front", "%===HINT===%")
    .limit(3);

  console.log("\nSample Data:");
  samples.forEach((c) => {
    console.log(`Front: ${c.front}`);
    console.log(`Back: ${c.back}`);
    console.log(`Forms:`, c.word_forms);
    console.log("-------------------");
  });
}
verify();
