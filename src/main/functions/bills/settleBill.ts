import 'reflect-metadata';

import { SettleBillController } from '@application/controllers/bills/SettleBillController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '../../adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(SettleBillController);

export const handler = lambdaHttpAdapter(controller);
