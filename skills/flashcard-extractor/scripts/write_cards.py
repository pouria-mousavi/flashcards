#!/usr/bin/env python3
"""Write extracted flashcards to a correctly-quoted CSV file.

Why this exists: Swedish sentences contain commas, quotes, and newlines that
break naive CSV string-building. This uses Python's csv module so the output is
always RFC 4180-valid and safe for a downstream bot to parse.

Usage:
    python write_cards.py cards.json -o flashcards.csv
    cat cards.json | python write_cards.py -o flashcards.csv
    python write_cards.py cards.json            # prints CSV to stdout

Input: a JSON array of card objects. Required keys: "front", "back".
Optional keys: "type" (word|phrase|grammar|sentence), "note" (provenance, e.g.
"book gloss" / "user handwriting" / "generated").
"""
import argparse
import csv
import json
import sys

FIELDS = ["front", "back", "type", "note"]


def load(src):
    raw = sys.stdin.read() if src is None else open(src, encoding="utf-8").read()
    data = json.loads(raw)
    if not isinstance(data, list):
        sys.exit("Input must be a JSON array of card objects.")
    return data


def main():
    p = argparse.ArgumentParser(description="Write flashcards to CSV.")
    p.add_argument("input", nargs="?", help="JSON file (omit to read stdin).")
    p.add_argument("-o", "--output", help="Output CSV path (omit for stdout).")
    args = p.parse_args()

    cards = load(args.input)
    out = open(args.output, "w", newline="", encoding="utf-8") if args.output else sys.stdout
    w = csv.DictWriter(out, fieldnames=FIELDS, quoting=csv.QUOTE_MINIMAL, extrasaction="ignore")
    w.writeheader()
    written = 0
    for i, c in enumerate(cards):
        if not c.get("front") or not c.get("back"):
            print(f"WARN: skipping card {i} (missing front or back)", file=sys.stderr)
            continue
        w.writerow({k: (c.get(k) or "") for k in FIELDS})
        written += 1
    if args.output:
        out.close()
    print(f"Wrote {written} card(s)" + (f" to {args.output}" if args.output else ""),
          file=sys.stderr)


if __name__ == "__main__":
    main()
