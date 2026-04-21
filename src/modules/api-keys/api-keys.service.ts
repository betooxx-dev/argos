import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'node:crypto';
import { IsNull, Not, Repository } from 'typeorm';

import { envs } from '@config/index';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { ApiKey } from './entities/api-key.entity';

export interface CreatedApiKey {
  token: string;
  record: ApiKey;
}

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeys: Repository<ApiKey>,
  ) {}

  async create(dto: CreateApiKeyDto): Promise<CreatedApiKey> {
    const existing = await this.apiKeys.findOne({
      where: { name: dto.name, revokedAt: IsNull() },
    });
    if (existing)
      throw new ConflictException(
        `An active API key with name "${dto.name}" already exists`,
      );

    const token = this.generateToken();
    const hash = createHash('sha256').update(token).digest('hex');
    const displayPrefix = token.slice(0, 16);

    const expiresAt =
      typeof dto.expiresInDays === 'number'
        ? new Date(Date.now() + dto.expiresInDays * 24 * 60 * 60 * 1000)
        : null;

    const record = await this.apiKeys.save(
      this.apiKeys.create({
        name: dto.name,
        hash,
        displayPrefix,
        scopes: dto.scopes ?? [],
        active: true,
        expiresAt,
        lastUsedAt: null,
        revokedAt: null,
      }),
    );

    return { token, record };
  }

  list(): Promise<ApiKey[]> {
    return this.apiKeys.find({ order: { createdAt: 'DESC' } });
  }

  listActive(): Promise<ApiKey[]> {
    return this.apiKeys.find({
      where: { active: true, revokedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async revoke(id: string): Promise<ApiKey> {
    const apiKey = await this.apiKeys.findOne({ where: { id } });
    if (!apiKey) throw new NotFoundException(`API key ${id} not found`);
    if (apiKey.revokedAt) return apiKey;

    apiKey.active = false;
    apiKey.revokedAt = new Date();
    return this.apiKeys.save(apiKey);
  }

  async revokeByName(name: string): Promise<ApiKey[]> {
    const keys = await this.apiKeys.find({
      where: { name, revokedAt: IsNull() },
    });
    if (keys.length === 0)
      throw new NotFoundException(`No active API keys found with name "${name}"`);

    const now = new Date();
    for (const key of keys) {
      key.active = false;
      key.revokedAt = now;
    }
    return this.apiKeys.save(keys);
  }

  async findRevoked(): Promise<ApiKey[]> {
    return this.apiKeys.find({
      where: { revokedAt: Not(IsNull()) },
      order: { revokedAt: 'DESC' },
    });
  }

  private generateToken(): string {
    const prefix = envs.apiKeyPrefix;
    const secret = randomBytes(32).toString('hex');
    return `${prefix}${secret}`;
  }
}
