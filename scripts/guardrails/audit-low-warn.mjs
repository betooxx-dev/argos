import { execSync } from 'node:child_process';

function getAuditReport() {
  try {
    const output = execSync('npm audit --json', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return JSON.parse(output);
  } catch (error) {
    if (error.stdout) return JSON.parse(error.stdout);
    throw error;
  }
}

const report = getAuditReport();
const lowVulnerabilities = Object.values(report.vulnerabilities ?? {}).filter(
  (entry) => entry.severity === 'low',
);

if (lowVulnerabilities.length === 0) process.exit(0);

console.warn(
  `[audit:low-warn] ${lowVulnerabilities.length} low severity vulnerability/vulnerabilities (warning only):`,
);

for (const vulnerability of lowVulnerabilities) {
  const name = vulnerability.name ?? vulnerability.via?.[0] ?? 'unknown';
  const title = vulnerability.title ?? vulnerability.url ?? 'no detail';
  console.warn(`  - ${name}: ${title}`);
}

