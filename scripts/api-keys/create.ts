import { ApiKeysService } from '../../src/modules/api-keys/api-keys.service';
import { parseArgs, runCli } from './_bootstrap';

function usage(): never {
  console.error(
    'Usage: npm run api-key:create -- --name <label> [--scopes a:b,c:d] [--expires-days 90]',
  );
  process.exit(1);
}

void runCli('api-key:create', async (app) => {
  const args = parseArgs(process.argv.slice(2));

  if (typeof args.name !== 'string' || !args.name) usage();

  const scopes =
    typeof args.scopes === 'string'
      ? args.scopes
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;

  const expiresInDays =
    typeof args['expires-days'] === 'string'
      ? Number.parseInt(args['expires-days'], 10)
      : undefined;

  if (expiresInDays !== undefined && !Number.isFinite(expiresInDays))
    throw new Error('--expires-days must be a positive integer');

  const service = app.get(ApiKeysService);
  const { token, record } = await service.create({
    name: args.name,
    scopes,
    expiresInDays,
  });

  console.log('\n  API key created — save this value, it will NOT be shown again:\n');
  console.log(`  ${token}\n`);
  console.log(`  id:          ${record.id}`);
  console.log(`  name:        ${record.name}`);
  console.log(`  prefix:      ${record.displayPrefix}`);
  console.log(`  scopes:      ${record.scopes.length ? record.scopes.join(', ') : '(none)'}`);
  console.log(
    `  expiresAt:   ${record.expiresAt ? record.expiresAt.toISOString() : '(never)'}`,
  );
  console.log('');
});
