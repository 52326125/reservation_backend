import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { REDIS_TOKEN } from 'src/const';

@Injectable()
export class RedisService {
  @Inject(REDIS_TOKEN)
  private redisClient: RedisClientType;

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      this.redisClient.expire(key, ttl);
    }
  }
}
