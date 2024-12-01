import * as dotenv from 'dotenv';
import { createClient, RedisClientType } from 'redis';

dotenv.config();

class CacheService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      password: process.env.REDIS_PASSWORD,
    });

    this.client.on('error', (error) => {
      console.error('Redis error', error);
    });
  }

  async initializeCache() {
    await this.client.connect();
  }

  async getSetMembers(key: string) {
    return this.client.sMembers(key);
  }

  async addSetMember(key: string, value: string) {
    return this.client.sAdd(key, value);
  }

  async removeSetMember(key: string, value: string) {
    return this.client.sRem(key, value);
  }
}

export const cacheService = new CacheService();
