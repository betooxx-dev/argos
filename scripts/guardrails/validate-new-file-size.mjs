import { readFileSync } from 'node:fs';

import { diffNameOnly, resolveBaseRef } from './_git.mjs';

const MAX_LINES = Number(process.env.MAX_NEW_FILE_LINES ?? 500);
const baseRef = resolveBaseRef();

const ignoredPatterns = [
  /^src\/migrations\//,
  /\.spec\.ts$/,
  /\.test\.ts$/,
  /\.d\.ts$/,
];

function isCheckedFile(file) {
  return (
    file.startsWith('src/') &&
    file.endsWith('.ts') &&
    !ignoredPatterns.some((pattern) => pattern.test(file))
  );
}

const newFiles = diffNameOnly({ baseRef, diffFilter: 'A' }).filter(isCheckedFile);
const violations = [];

for (const file of newFiles) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/).length;
  if (lines > MAX_LINES) violations.push({ file, lines });
}

if (violations.length > 0) {
  console.error(
    `[validate:file-size] New source files must stay at or below ${MAX_LINES} lines.`,
  );
  for (const violation of violations) {
    console.error(`  - ${violation.file}: ${violation.lines} lines`);
  }
  process.exit(1);
}

console.log(
  `[validate:file-size] OK: ${newFiles.length} new source file(s) checked against ${baseRef || 'no base ref'}.`,
);

