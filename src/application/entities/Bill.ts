import { v7 } from 'uuid';

export type BillType = 'payable' | 'receivable';
export type BillStoredStatus = 'open' | 'paid' | 'canceled';
export type BillStatus = BillStoredStatus | 'overdue';

export class Bill {
  readonly id: string;

  readonly accountId: string;

  readonly type: BillType;

  readonly description: string;

  readonly groupId: string;

  readonly installmentNumber: number;

  readonly installmentsTotal: number;

  /** YYYY-MM-DD */
  readonly dueDate: string;

  /** Valor em centavos. */
  readonly amountCents: number;

  paidCents: number;

  canceledAt: string | null;

  readonly createdAt: string;

  constructor(attributes: Bill.Attributes) {
    this.id = attributes.id ?? v7();
    this.accountId = attributes.accountId;
    this.type = attributes.type;
    this.description = attributes.description;
    this.groupId = attributes.groupId ?? this.id;
    this.installmentNumber = attributes.installmentNumber ?? 1;
    this.installmentsTotal = attributes.installmentsTotal ?? 1;
    this.dueDate = attributes.dueDate;
    this.amountCents = attributes.amountCents;
    this.paidCents = attributes.paidCents ?? 0;
    this.canceledAt = attributes.canceledAt ?? null;
    this.createdAt = attributes.createdAt ?? new Date().toISOString();
  }

  get remainingCents() {
    return this.amountCents - this.paidCents;
  }

  /** Status derivado: "overdue" = em aberto (total ou parcialmente) e vencido. */
  status(today: string = todayISO()): BillStatus {
    if (this.canceledAt) {return 'canceled';}
    if (this.paidCents >= this.amountCents) {return 'paid';}
    return this.dueDate < today ? 'overdue' : 'open';
  }

  settle(amountCents: number) {
    if (this.canceledAt) {throw new Bill.RuleError('BILL_CANCELED', 'Bill is canceled');}
    if (!Number.isInteger(amountCents) || amountCents <= 0) {
      throw new Bill.RuleError('INVALID_AMOUNT', 'Amount must be a positive integer (cents)');
    }
    if (amountCents > this.remainingCents) {
      throw new Bill.RuleError('AMOUNT_EXCEEDS_REMAINING', 'Amount exceeds the remaining balance');
    }
    this.paidCents += amountCents;
  }

  reverse(amountCents: number) {
    if (this.canceledAt) {throw new Bill.RuleError('BILL_CANCELED', 'Bill is canceled');}
    if (amountCents > this.paidCents) {
      throw new Bill.RuleError('INVALID_AMOUNT', 'Reversal exceeds the paid amount');
    }
    this.paidCents -= amountCents;
  }

  cancel() {
    if (this.canceledAt) {return;}
    if (this.paidCents > 0) {
      throw new Bill.RuleError('BILL_HAS_SETTLEMENTS', 'Reverse the settlements before canceling');
    }
    this.canceledAt = new Date().toISOString();
  }

  /** Cria parcelas mensais; o resto da divisão vai para a primeira parcela. */
  static createInstallments(input: Bill.InstallmentsInput): Bill[] {
    const { totalCents, installments, firstDueDate, ...rest } = input;
    if (!Number.isInteger(totalCents) || totalCents <= 0) {
      throw new Bill.RuleError('INVALID_AMOUNT', 'Total must be a positive integer (cents)');
    }
    if (!Number.isInteger(installments) || installments < 1 || installments > 360) {
      throw new Bill.RuleError('INVALID_INSTALLMENTS', 'Installments must be between 1 and 360');
    }
    if (totalCents < installments) {
      throw new Bill.RuleError('INVALID_AMOUNT', 'Total is smaller than the number of installments');
    }

    const groupId = v7();
    const base = Math.floor(totalCents / installments);
    const remainder = totalCents - base * installments;

    return Array.from({ length: installments }, (_, i) => new Bill({
      ...rest,
      groupId,
      installmentNumber: i + 1,
      installmentsTotal: installments,
      dueDate: addMonths(firstDueDate, i),
      amountCents: i === 0 ? base + remainder : base,
    }));
  }
}

export namespace Bill {
  export class RuleError extends Error {
    constructor(readonly code: string, message: string) {
      super(message);
      this.name = 'BillRuleError';
    }
  }

  export type Attributes = {
    id?: string;
    accountId: string;
    type: BillType;
    description: string;
    groupId?: string;
    installmentNumber?: number;
    installmentsTotal?: number;
    dueDate: string;
    amountCents: number;
    paidCents?: number;
    canceledAt?: string | null;
    createdAt?: string;
  };

  export type InstallmentsInput = {
    accountId: string;
    type: BillType;
    description: string;
    totalCents: number;
    installments: number;
    firstDueDate: string;
  };
}

export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

/** Soma meses mantendo o dia, limitado ao último dia do mês (31/01 + 1 => 28/02). */
export function addMonths(date: string, months: number) {
  const [y, m, d] = date.split('-').map(Number);
  const total = (m - 1) + months;
  const year = y + Math.floor(total / 12);
  const month = ((total % 12) + 12) % 12;
  const last = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const day = Math.min(d, last);
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
