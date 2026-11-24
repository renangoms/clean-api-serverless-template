import { bigint, date, index, integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const accountsTable = pgTable('accounts', {
  id: uuid().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  externalId: uuid('external_id'),
  createdAt: date('created_at').defaultNow().notNull(),
});

export const billsTable = pgTable('bills', {
  id: uuid().primaryKey(),
  accountId: uuid('account_id').notNull(),
  type: varchar({ length: 12 }).notNull(), // payable | receivable
  description: varchar({ length: 255 }).notNull(),
  groupId: uuid('group_id').notNull(),
  installmentNumber: integer('installment_number').notNull(),
  installmentsTotal: integer('installments_total').notNull(),
  dueDate: date('due_date').notNull(),
  amountCents: bigint('amount_cents', { mode: 'number' }).notNull(),
  paidCents: bigint('paid_cents', { mode: 'number' }).notNull().default(0),
  canceledAt: timestamp('canceled_at', { mode: 'string' }),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
}, t => [
  index('bills_account_due_idx').on(t.accountId, t.dueDate),
  index('bills_group_idx').on(t.groupId),
]);

export const billSettlementsTable = pgTable('bill_settlements', {
  id: uuid().primaryKey(),
  billId: uuid('bill_id').notNull().references(() => billsTable.id),
  amountCents: bigint('amount_cents', { mode: 'number' }).notNull(),
  paidAt: date('paid_at').notNull(),
  reversedAt: timestamp('reversed_at', { mode: 'string' }),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
}, t => [index('bill_settlements_bill_idx').on(t.billId)]);
