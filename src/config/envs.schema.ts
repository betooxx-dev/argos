import * as joi from 'joi';

export const envsSchema = joi
  .object({
    STAGE: joi.string().valid('dev', 'prod').default('dev'),
    PORT: joi.number().default(5000),
    CLIENT_URL: joi.string().uri({ allowRelative: false }).required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().port().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    JWT_SECRET: joi.string().min(32).required(),
    API_KEY_PREFIX: joi
      .string()
      .pattern(/^[a-z0-9]+_$/)
      .default('argos_'),
  })
  .unknown(true);
