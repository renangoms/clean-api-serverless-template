import { Bill } from '@application/entities/Bill';

export function billView(bill: Bill) {
  return {
    id: bill.id,
    type: bill.type,
    description: bill.description,
    groupId: bill.groupId,
    installmentNumber: bill.installmentNumber,
    installmentsTotal: bill.installmentsTotal,
    dueDate: bill.dueDate,
    amountCents: bill.amountCents,
    paidCents: bill.paidCents,
    remainingCents: bill.remainingCents,
    status: bill.status(),
    canceledAt: bill.canceledAt,
    createdAt: bill.createdAt,
  };
}

export type BillView = ReturnType<typeof billView>;
