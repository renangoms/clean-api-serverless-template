import { Bill, BillType } from '@application/entities/Bill';
import { guardBillRules } from '@application/errors/application/BillErrors';
import { Injectable } from '@kernel/decorators/Injectable';
import { BillRepository } from 'src/infra/database/repositories/BillRepository';
import { BillView, billView } from './billView';

@Injectable()
export class CreateBillUseCase {
  constructor(private readonly billRepository: BillRepository) { }

  async execute(input: CreateBillUseCase.Input): Promise<CreateBillUseCase.Output> {
    const bills = guardBillRules(() => Bill.createInstallments(input));
    await this.billRepository.createMany(bills);
    return { bills: bills.map(billView) };
  }
}

export namespace CreateBillUseCase {
  export type Input = {
    accountId: string;
    type: BillType;
    description: string;
    totalCents: number;
    installments: number;
    firstDueDate: string;
  };
  export type Output = { bills: BillView[] };
}
