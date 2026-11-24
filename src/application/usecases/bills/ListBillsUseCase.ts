import { Bill } from '@application/entities/Bill';
import { Injectable } from '@kernel/decorators/Injectable';
import { BillRepository } from 'src/infra/database/repositories/BillRepository';
import { BillView, billView } from './billView';

@Injectable()
export class ListBillsUseCase {
  constructor(private readonly billRepository: BillRepository) { }

  async execute({ accountId, status, ...filters }: ListBillsUseCase.Input): Promise<ListBillsUseCase.Output> {
    const bills: Bill[] = await this.billRepository.list(accountId, filters);
    // status "atrasado" é derivado (vencimento x saldo), então filtra após a leitura
    const filtered = status ? bills.filter(b => b.status() === status) : bills;
    return { bills: filtered.map(billView) };
  }
}

export namespace ListBillsUseCase {
  export type Input = {
    accountId: string;
    type?: 'payable' | 'receivable';
    status?: 'open' | 'paid' | 'overdue' | 'canceled';
    from?: string;
    to?: string;
    groupId?: string;
  };
  export type Output = { bills: BillView[] };
}
