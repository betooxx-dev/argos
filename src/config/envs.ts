import 'dotenv/config';
import type { ValidationResult } from 'joi';

import { envsSchema } from './envs.schema';

interface EnvVars {
  STAGE: string;
  PORT: number;
  CLIENT_URL: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
  API_KEY_PREFIX: string;
}

const validation = envsSchema.validate(
  process.env,
) as ValidationResult<EnvVars>;

if (validation.error) {
  throw new Error(`Config validation error: ${validation.error.message}`);
}

const envVars = validation.value;

export const envs = {
  stage: envVars.STAGE,
  port: envVars.PORT,
  clientUrl: envVars.CLIENT_URL,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  dbUser: envVars.DB_USER,
  dbPassword: envVars.DB_PASSWORD,
  dbName: envVars.DB_NAME,
  jwtSecret: envVars.JWT_SECRET,
  apiKeyPrefix: envVars.API_KEY_PREFIX,
};
