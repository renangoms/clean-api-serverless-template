import 'reflect-metadata';

import { GetBillController } from '@application/controllers/bills/GetBillController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '../../adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(GetBillController);

export const handler = lambdaHttpAdapter(controller);
