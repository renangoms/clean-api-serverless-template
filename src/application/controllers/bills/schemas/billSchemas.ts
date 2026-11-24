import { z } from 'zod';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

export const createBillSchema = z.object({
  type: z.enum(['payable', 'receivable']),
  description: z.string().min(1).max(255),
  totalCents: z.number().int().positive(),
  installments: z.number().int().min(1).max(360).default(1),
  firstDueDate: isoDate,
});
export type CreateBillBody = z.infer<typeof createBillSchema>;

export const settleBillSchema = z.object({
  amountCents: z.number().int().positive().optional(),
  paidAt: isoDate.optional(),
});
export type SettleBillBody = z.infer<typeof settleBillSchema>;
