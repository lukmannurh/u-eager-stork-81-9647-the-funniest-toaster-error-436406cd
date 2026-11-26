// The Funniest Toaster Error Message
// Writes one line (<=120 chars) to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output).
// Plain JavaScript syntax only (no TS-only constructs) so it runs under Node 22
// type-stripping as main.ts.
//
// Gate (sealed scorer): /output/entry.txt must be UTF-8 text of 1 to 120
// characters, not only white space. This program validates the line against
// every part of that gate BEFORE writing anything, and fails loudly (exit 1,
// error on stderr) if any check fails, so a broken line can never be written
// out as a silent invalid entry.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = "ERROR: The bread is fine. It is you I am worried about.";

// Gate limits, from the competition rules (RULES.txt, "The gate").
const GATE_MIN_CHARS = 1;
const GATE_MAX_CHARS = 120;

// Count characters as Unicode code points, not UTF-16 code units, so the
// length check matches what a UTF-8 scorer counts.
const charCount = [...ENTRY].length;

const failures = [];

if (charCount < GATE_MIN_CHARS || charCount > GATE_MAX_CHARS) {
  failures.push(
    `length ${charCount} chars is outside the gate range ` +
      `${GATE_MIN_CHARS}-${GATE_MAX_CHARS}`,
  );
}

if (/[\r\n]/.test(ENTRY)) {
  failures.push("entry must be a single line (contains CR or LF)");
}

if (ENTRY.trim().length === 0) {
  failures.push("entry is only white space");
}

// UTF-8 round-trip: the bytes we would write must decode back to the
// exact same string, otherwise the file is not clean UTF-8 text.
if (Buffer.from(ENTRY, "utf8").toString("utf8") !== ENTRY) {
  failures.push("entry does not survive a UTF-8 round-trip");
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`GATE FAIL: ${failure}`);
  }
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
