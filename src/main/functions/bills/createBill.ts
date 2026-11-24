import 'reflect-metadata';

import { CreateBillController } from '@application/controllers/bills/CreateBillController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '../../adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(CreateBillController);

export const handler = lambdaHttpAdapter(controller);
