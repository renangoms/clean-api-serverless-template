import { date, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const accountsTable = pgTable('accounts', {
  id: uuid().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  externalId: uuid('external_id'),
  createdAt: date('created_at').defaultNow().notNull(),
});
