import { integer, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('User', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  updatedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
});
