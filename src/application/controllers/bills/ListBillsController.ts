import { Controller } from '@application/contracts/Controller';
import { ListBillsUseCase } from '@application/usecases/bills/ListBillsUseCase';
import { Injectable } from '@kernel/decorators/Injectable';

@Injectable()
export class ListBillsController extends Controller<'private', unknown> {
  constructor(private readonly useCase: ListBillsUseCase) {
    super();
  }

  protected override async handle(
    { accountId, body, params, queryParams }: Controller.Request<'private'>,
  ): Promise<Controller.Response<unknown>> {
    void body; void params;
    const result = await this.useCase.execute({ accountId, ...queryParams as Omit<ListBillsUseCase.Input, 'accountId'> });
    return { statusCode: 200, body: result };
  }
}
