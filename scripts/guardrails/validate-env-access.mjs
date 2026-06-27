import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const allowedPrefixes = [path.resolve('src/config')];
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
    if (allowedPrefixes.some((prefix) => fullPath.startsWith(prefix))) continue;

    const content = readFileSync(fullPath, 'utf8');
    if (!/\bprocess\.env\b/.test(content)) continue;

    violations.push(path.relative(process.cwd(), fullPath).replaceAll('\\', '/'));
  }
}

walk(root);

if (violations.length > 0) {
  console.error('[validate:env-access] process.env is only allowed in src/config/.');
  for (const file of violations) console.error(`  - ${file}`);
  process.exit(1);
}

console.log('[validate:env-access] OK: no process.env access outside src/config/.');

