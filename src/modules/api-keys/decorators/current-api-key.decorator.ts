import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import type { ApiKey } from '../entities/api-key.entity';

export const CurrentApiKey = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ApiKey | undefined => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.apiKey;
  },
);
