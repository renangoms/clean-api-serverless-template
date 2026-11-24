import { Bill } from '@application/entities/Bill';
import { ErrorCode } from '../ErrorCode';
import { ApplicationError } from './AplicationError';

export class BillNotFound extends ApplicationError {
  public override statusCode = 404;

  public override code = ErrorCode.BILL_NOT_FOUND;

  constructor() {
    super('Bill not found');
    this.name = 'BillNotFound';
  }
}

export class SettlementNotFound extends ApplicationError {
  public override statusCode = 404;

  public override code = ErrorCode.SETTLEMENT_NOT_FOUND;

  constructor() {
    super('Settlement not found');
    this.name = 'SettlementNotFound';
  }
}

export class SettlementAlreadyReversed extends ApplicationError {
  public override statusCode = 409;

  public override code = ErrorCode.SETTLEMENT_ALREADY_REVERSED;

  constructor() {
    super('Settlement already reversed');
    this.name = 'SettlementAlreadyReversed';
  }
}

export class BillRuleViolation extends ApplicationError {
  public override statusCode = 422;

  public override code: ErrorCode;

  constructor(error: Bill.RuleError) {
    super(error.message);
    this.name = 'BillRuleViolation';
    this.code = (ErrorCode as Record<string, ErrorCode>)[error.code] ?? ErrorCode.BAD_REQUEST;
  }
}

/** Converte violações de regra do domínio em erro de aplicação (HTTP 422). */
export function guardBillRules<T>(fn: () => T): T {
  try {
    return fn();
  } catch (error) {
    if (error instanceof Bill.RuleError) {throw new BillRuleViolation(error);}
    throw error;
  }
}

export class ConcurrentUpdate extends ApplicationError {
  public override statusCode = 409;

  public override code = ErrorCode.CONCURRENT_UPDATE;

  constructor() {
    super('The bill was changed by another request, try again');
    this.name = 'ConcurrentUpdate';
  }
}
