import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { INestApplicationContext } from '@nestjs/common';

import { AppModule } from '../../src/app.module';

export async function createContext(): Promise<INestApplicationContext> {
  return NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });
}

export async function runCli(
  name: string,
  fn: (app: INestApplicationContext) => Promise<void>,
): Promise<void> {
  const logger = new Logger(name);
  let app: INestApplicationContext | undefined;
  try {
    app = await createContext();
    await fn(app);
    process.exitCode = 0;
  } catch (err) {
    logger.error(err instanceof Error ? err.message : String(err));
    if (err instanceof Error && err.stack) logger.error(err.stack);
    process.exitCode = 1;
  } finally {
    if (app) await app.close();
  }
}

export function parseArgs(argv: string[]): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      out[key] = true;
    } else {
      out[key] = next;
      i++;
    }
  }
  return out;
}
