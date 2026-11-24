import 'reflect-metadata';

import { ListBillsController } from '@application/controllers/bills/ListBillsController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '../../adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(ListBillsController);

export const handler = lambdaHttpAdapter(controller);
