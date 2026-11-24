import 'reflect-metadata';

import { CancelBillController } from '@application/controllers/bills/CancelBillController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '../../adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(CancelBillController);

export const handler = lambdaHttpAdapter(controller);
