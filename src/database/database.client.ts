import { drizzle } from 'drizzle-orm/node-postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const user = `${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}`;
const host = `${process.env.DB_HOST}:${process.env.DB_PORT}`;
const url = `postgresql://${user}@${host}/${process.env.DB_SCHEMA}`;

export const db = drizzle(url);
