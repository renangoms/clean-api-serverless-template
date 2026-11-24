import { Controller } from '@application/contracts/Controller';
import { CreateBillUseCase } from '@application/usecases/bills/CreateBillUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { createBillSchema, CreateBillBody } from './schemas/billSchemas';
import { Schema } from '@kernel/decorators/Schema';

@Injectable()
@Schema(createBillSchema)
export class CreateBillController extends Controller<'private', unknown> {
  constructor(private readonly useCase: CreateBillUseCase) {
    super();
  }

  protected override async handle(
    { accountId, body, params, queryParams }: Controller.Request<'private', CreateBillBody>,
  ): Promise<Controller.Response<unknown>> {
    void params; void queryParams;
    const result = await this.useCase.execute({ accountId, ...body });
    return { statusCode: 201, body: result };
  }
}
