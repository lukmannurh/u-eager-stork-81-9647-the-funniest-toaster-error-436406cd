// The Funniest Toaster Error Message
// Writes one line (<=120 chars) to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output).
// Plain JavaScript syntax only (no TS-only constructs) so it runs under Node 22
// type-stripping as main.ts.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = "ERROR: The bread is fine. It is you I am worried about.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
