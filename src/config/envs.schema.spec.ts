import { envsSchema } from './envs.schema';

const validEnv = {
  CLIENT_URL: 'http://localhost:3000',
  DB_HOST: 'localhost',
  DB_PORT: 5432,
  DB_USER: 'postgres',
  DB_PASSWORD: 'postgres',
  DB_NAME: 'argos',
  JWT_SECRET: 'a'.repeat(32),
};

describe('envsSchema', () => {
  it('applies safe defaults for optional runtime settings', () => {
    const result = envsSchema.validate(validEnv);

    expect(result.error).toBeUndefined();
    expect(result.value as Record<string, unknown>).toMatchObject({
      STAGE: 'dev',
      PORT: 5000,
      API_KEY_PREFIX: 'argos_',
    });
  });

  it('rejects weak JWT secrets', () => {
    const result = envsSchema.validate({
      ...validEnv,
      JWT_SECRET: 'too-short',
    });

    expect(result.error?.message).toContain('JWT_SECRET');
  });

  it('rejects invalid API key prefixes', () => {
    const result = envsSchema.validate({
      ...validEnv,
      API_KEY_PREFIX: 'Argos',
    });

    expect(result.error?.message).toContain('API_KEY_PREFIX');
  });
});
