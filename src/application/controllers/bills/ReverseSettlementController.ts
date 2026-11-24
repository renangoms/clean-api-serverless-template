import { Controller } from '@application/contracts/Controller';
import { ReverseSettlementUseCase } from '@application/usecases/bills/ReverseSettlementUseCase';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ReverseSettlementController extends Controller<'private', unknown> {
  constructor(private readonly useCase: ReverseSettlementUseCase) {
    super();
  }

  protected override async handle(
    { accountId, body, params, queryParams }: Controller.Request<'private'>,
  ): Promise<Controller.Response<unknown>> {
    void body; void queryParams;
    const result = await this.useCase.execute({
      accountId, billId: params.billId as string, settlementId: params.settlementId as string,
    });
    return { statusCode: 200, body: result };
  }
}
