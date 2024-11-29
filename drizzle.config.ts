import { defineConfig } from 'drizzle-kit';

const user = `${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}`;
const host = `${process.env.DB_HOST}:${process.env.DB_PORT}`;
const url = `postgresql://${user}@${host}/${process.env.DB_SCHEMA}`;

const databaseConfig = defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url },
  schema: './src/database/database.schema.ts',
});

export default databaseConfig;
