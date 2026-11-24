import {
  BillNotFound, ConcurrentUpdate, guardBillRules, SettlementAlreadyReversed, SettlementNotFound,
} from '@application/errors/application/BillErrors';
import { Injectable } from '@kernel/decorators/Injectable';
import { BillRepository } from 'src/infra/database/repositories/BillRepository';
import { billView } from './billView';

@Injectable()
export class ReverseSettlementUseCase {
  constructor(private readonly billRepository: BillRepository) { }

  async execute({ accountId, billId, settlementId }: ReverseSettlementUseCase.Input) {
    const bill = await this.billRepository.findById(billId, accountId);
    if (!bill) {throw new BillNotFound();}

    const settlement = await this.billRepository.findSettlement(settlementId, billId);
    if (!settlement) {throw new SettlementNotFound();}
    if (settlement.reversedAt) {throw new SettlementAlreadyReversed();}

    const previousPaidCents = bill.paidCents;
    guardBillRules(() => bill.reverse(settlement.amountCents));
    settlement.reversedAt = new Date().toISOString();

    if (!await this.billRepository.saveReversal(bill, settlement, previousPaidCents)) {
      throw new ConcurrentUpdate();
    }

    return { bill: billView(bill), settlement };
  }
}

export namespace ReverseSettlementUseCase {
  export type Input = { accountId: string; billId: string; settlementId: string };
}
