import { Controller } from '@application/contracts/Controller';
import { CancelBillUseCase } from '@application/usecases/bills/CancelBillUseCase';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class CancelBillController extends Controller<'private', unknown> {
  constructor(private readonly useCase: CancelBillUseCase) {
    super();
  }

  protected override async handle(
    { accountId, body, params, queryParams }: Controller.Request<'private'>,
  ): Promise<Controller.Response<unknown>> {
    void body; void queryParams;
    const result = await this.useCase.execute({ accountId, billId: params.billId as string });
    return { statusCode: 200, body: result };
  }
}
