import { v7 } from 'uuid';

export class BillSettlement {
  readonly id: string;

  readonly billId: string;

  readonly amountCents: number;

  /** YYYY-MM-DD */
  readonly paidAt: string;

  reversedAt: string | null;

  readonly createdAt: string;

  constructor(attributes: BillSettlement.Attributes) {
    this.id = attributes.id ?? v7();
    this.billId = attributes.billId;
    this.amountCents = attributes.amountCents;
    this.paidAt = attributes.paidAt;
    this.reversedAt = attributes.reversedAt ?? null;
    this.createdAt = attributes.createdAt ?? new Date().toISOString();
  }
}

export namespace BillSettlement {
  export type Attributes = {
    id?: string;
    billId: string;
    amountCents: number;
    paidAt: string;
    reversedAt?: string | null;
    createdAt?: string;
  };
}
