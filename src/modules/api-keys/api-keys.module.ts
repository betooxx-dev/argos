import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiKeysService } from './api-keys.service';
import { ApiKey } from './entities/api-key.entity';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ScopesGuard } from './guards/scopes.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKey])],
  providers: [
    ApiKeysService,
    ApiKeyGuard,
    ScopesGuard,
    { provide: APP_GUARD, useExisting: ApiKeyGuard },
    { provide: APP_GUARD, useExisting: ScopesGuard },
  ],
  exports: [ApiKeysService, ApiKeyGuard, ScopesGuard],
})
export class ApiKeysModule {}
