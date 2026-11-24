import { Bill, BillType } from '@application/entities/Bill';
import { BillSettlement } from '@application/entities/BillSettlement';
import { Injectable } from '@kernel/decorators/Injectable';
import { and, asc, eq, gte, lte } from 'drizzle-orm';
import { db } from '../drizzle';
import { billSettlementsTable, billsTable } from '../drizzle/schema';

type BillRow = typeof billsTable.$inferSelect;

const toBill = (row: BillRow) => new Bill({ ...row, type: row.type as BillType });

@Injectable()
export class BillRepository {
  async createMany(bills: Bill[]): Promise<void> {
    await db.insert(billsTable).values(bills.map(b => ({ ...b })));
  }

  async findById(id: string, accountId: string): Promise<Bill | null> {
    const row = await db.query.billsTable.findFirst({
      where: and(eq(billsTable.id, id), eq(billsTable.accountId, accountId)),
    });
    return row ? toBill(row) : null;
  }

  async list(accountId: string, filters: BillRepository.Filters): Promise<Bill[]> {
    const rows = await db.query.billsTable.findMany({
      where: and(
        eq(billsTable.accountId, accountId),
        filters.type ? eq(billsTable.type, filters.type) : undefined,
        filters.from ? gte(billsTable.dueDate, filters.from) : undefined,
        filters.to ? lte(billsTable.dueDate, filters.to) : undefined,
        filters.groupId ? eq(billsTable.groupId, filters.groupId) : undefined,
      ),
      orderBy: [asc(billsTable.dueDate)],
      limit: 500,
    });
    return rows.map(toBill);
  }

  async listSettlements(billId: string): Promise<BillSettlement[]> {
    const rows = await db.query.billSettlementsTable.findMany({
      where: eq(billSettlementsTable.billId, billId),
      orderBy: [asc(billSettlementsTable.createdAt)],
    });
    return rows.map(r => new BillSettlement(r));
  }

  async findSettlement(id: string, billId: string): Promise<BillSettlement | null> {
    const row = await db.query.billSettlementsTable.findFirst({
      where: and(eq(billSettlementsTable.id, id), eq(billSettlementsTable.billId, billId)),
    });
    return row ? new BillSettlement(row) : null;
  }

  /**
   * Baixa: o saldo é atualizado primeiro com controle otimista (só aplica se o
   * saldo pago não mudou desde a leitura); a liquidação só é gravada se o saldo
   * foi aplicado. O driver neon-http não tem transação interativa.
   */
  async saveSettlement(bill: Bill, settlement: BillSettlement, previousPaidCents: number): Promise<boolean> {
    if (!await this.updatePaid(bill, previousPaidCents)) {return false;}
    await db.insert(billSettlementsTable).values({ ...settlement });
    return true;
  }

  async saveReversal(bill: Bill, settlement: BillSettlement, previousPaidCents: number): Promise<boolean> {
    if (!await this.updatePaid(bill, previousPaidCents)) {return false;}
    await db.update(billSettlementsTable).set({ reversedAt: settlement.reversedAt })
      .where(eq(billSettlementsTable.id, settlement.id));
    return true;
  }

  private async updatePaid(bill: Bill, previousPaidCents: number): Promise<boolean> {
    const updated = await db.update(billsTable).set({ paidCents: bill.paidCents })
      .where(and(eq(billsTable.id, bill.id), eq(billsTable.paidCents, previousPaidCents)))
      .returning({ id: billsTable.id });
    return updated.length > 0;
  }

  async saveCancel(bill: Bill): Promise<void> {
    await db.update(billsTable).set({ canceledAt: bill.canceledAt }).where(eq(billsTable.id, bill.id));
  }
}

export namespace BillRepository {
  export type Filters = { type?: BillType; from?: string; to?: string; groupId?: string };
}

