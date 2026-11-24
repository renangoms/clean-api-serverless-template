import 'reflect-metadata';

import { ReverseSettlementController } from '@application/controllers/bills/ReverseSettlementController';
import { Registry } from '@kernel/di/Registry';
import { lambdaHttpAdapter } from '../../adapters/lambdaHttpAdapter';

const controller = Registry.getInstance().resolve(ReverseSettlementController);

export const handler = lambdaHttpAdapter(controller);
