import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const srcRoot = path.resolve('src');
const routeDecoratorPattern = /^@(Get|Post|Put|Patch|Delete|All|Options|Head)\b/;
const securityDecoratorPattern = /^@(Public|RequireScopes|UseGuards)\b/;
const unsafeParamPattern = /@(Body|Query|Param)\([^)]*\)\s+\w+\s*:\s*any\b/;
const violations = [];
let checkedRoutes = 0;

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walk(fullPath, files);
      continue;
    }

    if (entry.endsWith('.controller.ts')) files.push(fullPath);
  }

  return files;
}

function checkController(filePath) {
  const relative = path.relative(process.cwd(), filePath).replaceAll('\\', '/');
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);
  let classHasSecurity = false;
  let decorators = [];
  let pendingRoute = null;

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (unsafeParamPattern.test(trimmed)) {
      violations.push({
        file: relative,
        line: index + 1,
        rule: 'unsafe-any-param',
        message: 'Use a DTO or typed params instead of any.',
      });
    }

    if (trimmed.startsWith('@')) {
      decorators.push(trimmed);
      if (routeDecoratorPattern.test(trimmed)) {
        pendingRoute = {
          line: index + 1,
          decorators: [...decorators],
        };
      }
      return;
    }

    if (/^export\s+class\s+\w+|^class\s+\w+/.test(trimmed)) {
      classHasSecurity = decorators.some((decorator) =>
        securityDecoratorPattern.test(decorator),
      );
      decorators = [];
      return;
    }

    if (pendingRoute && /^[A-Za-z_]\w*\s*\(/.test(trimmed)) {
      checkedRoutes += 1;
      const methodHasSecurity = pendingRoute.decorators.some((decorator) =>
        securityDecoratorPattern.test(decorator),
      );

      if (!classHasSecurity && !methodHasSecurity) {
        violations.push({
          file: relative,
          line: pendingRoute.line,
          rule: 'missing-route-security',
          message: 'Every route must explicitly declare @Public(), @RequireScopes(), or @UseGuards().',
        });
      }

      pendingRoute = null;
      decorators = [];
      return;
    }

    if (trimmed && !trimmed.startsWith('//')) decorators = [];
  });
}

for (const filePath of walk(srcRoot)) checkController(filePath);

if (violations.length > 0) {
  console.error('[validate:controller-security] Controller guardrail violations:');
  for (const violation of violations) {
    console.error(
      `  - ${violation.file}:${violation.line} [${violation.rule}] ${violation.message}`,
    );
  }
  process.exit(1);
}

console.log(
  `[validate:controller-security] OK: ${checkedRoutes} route handler(s) checked.`,
);

