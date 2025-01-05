import * as dotenv from 'dotenv';
import { createClient } from 'redis';

dotenv.config();

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (error) => {
  console.error('Redis error', error);
});

export const initializeCache = async () => {
  await redisClient.connect();
};

export const getSetMembers = async (key: string) => {
  return redisClient.sMembers(key);
};

export const addSetMember = async (key: string, value: string) => {
  return redisClient.sAdd(key, value);
};

export const removeSetMember = async (key: string, value: string) => {
  return redisClient.sRem(key, value);
};
