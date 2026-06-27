import { diffNameOnly, resolveBaseRef } from './_git.mjs';

const baseRef = resolveBaseRef();
const changedFiles = diffNameOnly({ baseRef });

const entityFiles = changedFiles.filter(
  (file) => file.startsWith('src/') && file.endsWith('.entity.ts'),
);
const migrationFiles = changedFiles.filter((file) =>
  file.startsWith('src/migrations/'),
);

if (entityFiles.length > 0 && migrationFiles.length === 0) {
  console.error(
    '[validate:migrations] Entity changes require a matching migration in src/migrations/.',
  );
  for (const file of entityFiles) console.error(`  - ${file}`);
  process.exit(1);
}

console.log(
  `[validate:migrations] OK: ${entityFiles.length} entity file(s), ${migrationFiles.length} migration file(s).`,
);

