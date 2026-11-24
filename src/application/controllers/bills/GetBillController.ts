import { Controller } from '@application/contracts/Controller';
import { GetBillUseCase } from '@application/usecases/bills/GetBillUseCase';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class GetBillController extends Controller<'private', unknown> {
  constructor(private readonly useCase: GetBillUseCase) {
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
