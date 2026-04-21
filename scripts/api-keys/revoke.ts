import { ApiKeysService } from '../../src/modules/api-keys/api-keys.service';
import { parseArgs, runCli } from './_bootstrap';

function usage(): never {
  console.error(
    'Usage: npm run api-key:revoke -- --id <uuid>   |   --name <label>',
  );
  process.exit(1);
}

void runCli('api-key:revoke', async (app) => {
  const args = parseArgs(process.argv.slice(2));
  const service = app.get(ApiKeysService);

  if (typeof args.id === 'string' && args.id) {
    const record = await service.revoke(args.id);
    console.log(`  Revoked API key ${record.id} (name: ${record.name})`);
    return;
  }

  if (typeof args.name === 'string' && args.name) {
    const records = await service.revokeByName(args.name);
    for (const r of records)
      console.log(`  Revoked API key ${r.id} (name: ${r.name})`);
    return;
  }

  usage();
});
