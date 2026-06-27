import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const violations = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!entry.endsWith('.ts')) continue;
    if (fullPath.includes(`${path.sep}migrations${path.sep}`)) continue;

    const relative = path.relative(process.cwd(), fullPath).replaceAll('\\', '/');
    const lines = readFileSync(fullPath, 'utf8').split(/\r?\n/);

    lines.forEach((line, index) => {
      if (/\bsynchronize\s*:\s*true\b/.test(line)) {
        violations.push({
          file: relative,
          line: index + 1,
          rule: 'fixed-synchronize-true',
          snippet: line.trim(),
        });
      }

      if (/\.\s*query\s*\(/.test(line)) {
        violations.push({
          file: relative,
          line: index + 1,
          rule: 'raw-query',
          snippet: line.trim(),
        });
      }
    });
  }
}

walk(root);

if (violations.length > 0) {
  console.error('[validate:typeorm-safety] Unsafe TypeORM patterns detected:');
  for (const violation of violations) {
    console.error(
      `  - ${violation.file}:${violation.line} [${violation.rule}] ${violation.snippet}`,
    );
  }
  process.exit(1);
}

console.log('[validate:typeorm-safety] OK: no fixed synchronize:true or raw queries.');

