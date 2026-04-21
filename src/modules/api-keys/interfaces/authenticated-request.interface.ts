import type { Request } from 'express';
import type { ApiKey } from '../entities/api-key.entity';

export interface AuthenticatedRequest extends Request {
  apiKey?: ApiKey;
}
