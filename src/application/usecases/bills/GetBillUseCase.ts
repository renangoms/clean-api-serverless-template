import { BillNotFound } from '@application/errors/application/BillErrors';
import { Injectable } from '@kernel/decorators/Injectable';
import { BillRepository } from 'src/infra/database/repositories/BillRepository';
import { billView } from './billView';

@Injectable()
export class GetBillUseCase {
  constructor(private readonly billRepository: BillRepository) { }

  async execute({ accountId, billId }: { accountId: string; billId: string }) {
    const bill = await this.billRepository.findById(billId, accountId);
    if (!bill) {throw new BillNotFound();}
    const settlements = await this.billRepository.listSettlements(bill.id);
    return { bill: billView(bill), settlements };
  }
}
