import { Controller } from '@application/contracts/Controller';
import { SettleBillUseCase } from '@application/usecases/bills/SettleBillUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { settleBillSchema, SettleBillBody } from './schemas/billSchemas';
import { Schema } from '@kernel/decorators/Schema';

@Injectable()
@Schema(settleBillSchema)
export class SettleBillController extends Controller<'private', unknown> {
  constructor(private readonly useCase: SettleBillUseCase) {
    super();
  }

  protected override async handle(
    { accountId, body, params, queryParams }: Controller.Request<'private', SettleBillBody>,
  ): Promise<Controller.Response<unknown>> {
    void queryParams;
    const result = await this.useCase.execute({ accountId, billId: params.billId as string, ...body });
    return { statusCode: 201, body: result };
  }
}
