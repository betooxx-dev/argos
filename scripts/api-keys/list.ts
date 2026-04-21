import { ApiKeysService } from '../../src/modules/api-keys/api-keys.service';
import { runCli } from './_bootstrap';

function fmt(d: Date | null | undefined): string {
  return d ? d.toISOString() : '—';
}

function statusOf(key: {
  active: boolean;
  revokedAt: Date | null;
  expiresAt: Date | null;
}): string {
  if (key.revokedAt) return 'revoked';
  if (!key.active) return 'inactive';
  if (key.expiresAt && key.expiresAt.getTime() <= Date.now()) return 'expired';
  return 'active';
}

void runCli('api-key:list', async (app) => {
  const service = app.get(ApiKeysService);
  const keys = await service.list();

  if (keys.length === 0) {
    console.log('No API keys found.');
    return;
  }

  console.log('');
  for (const k of keys) {
    console.log(`  [${statusOf(k)}]  ${k.name}`);
    console.log(`    id:         ${k.id}`);
    console.log(`    prefix:     ${k.displayPrefix}`);
    console.log(`    scopes:     ${k.scopes.length ? k.scopes.join(', ') : '(none)'}`);
    console.log(`    createdAt:  ${fmt(k.createdAt)}`);
    console.log(`    lastUsedAt: ${fmt(k.lastUsedAt)}`);
    console.log(`    expiresAt:  ${fmt(k.expiresAt)}`);
    console.log(`    revokedAt:  ${fmt(k.revokedAt)}`);
    console.log('');
  }
});
