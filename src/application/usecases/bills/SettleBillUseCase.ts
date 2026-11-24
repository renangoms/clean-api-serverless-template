import { todayISO } from '@application/entities/Bill';
import { BillSettlement } from '@application/entities/BillSettlement';
import { BillNotFound, ConcurrentUpdate, guardBillRules } from '@application/errors/application/BillErrors';
import { Injectable } from '@kernel/decorators/Injectable';
import { BillRepository } from 'src/infra/database/repositories/BillRepository';
import { billView } from './billView';

@Injectable()
export class SettleBillUseCase {
  constructor(private readonly billRepository: BillRepository) { }

  /** Baixa total (sem amountCents) ou parcial (com amountCents). */
  async execute({ accountId, billId, amountCents, paidAt }: SettleBillUseCase.Input) {
    const bill = await this.billRepository.findById(billId, accountId);
    if (!bill) {throw new BillNotFound();}

    const previousPaidCents = bill.paidCents;
    const amount = amountCents ?? bill.remainingCents;
    guardBillRules(() => bill.settle(amount));

    const settlement = new BillSettlement({ billId, amountCents: amount, paidAt: paidAt ?? todayISO() });
    if (!await this.billRepository.saveSettlement(bill, settlement, previousPaidCents)) {
      throw new ConcurrentUpdate();
    }

    return { bill: billView(bill), settlement };
  }
}

export namespace SettleBillUseCase {
  export type Input = { accountId: string; billId: string; amountCents?: number; paidAt?: string };
}
