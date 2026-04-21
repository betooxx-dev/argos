import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { SCOPES_KEY } from '../decorators/require-scopes.decorator';
import type { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const required = this.reflector.getAllAndOverride<string[]>(SCOPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const { apiKey } = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();

    if (!apiKey)
      throw new ForbiddenException('API key not resolved before scope check');

    const granted = new Set(apiKey.scopes ?? []);
    const missing = required.filter((scope) => !granted.has(scope));

    if (missing.length > 0)
      throw new ForbiddenException(
        `API key missing required scopes: ${missing.join(', ')}`,
      );

    return true;
  }
}
