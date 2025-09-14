import { v7 } from 'uuid';

export class Account {
  readonly id: string;

  readonly email: string;

  externalId: string | null;

  readonly createdAt: string;

  constructor(attributes: Account.Attributes) {
    this.id = attributes.id ?? v7();
    this.email = attributes.email;
    this.externalId = attributes.externalId ?? null;
    this.createdAt = attributes.createdAt ?? new Date().toISOString().split('T')[0];
  }
}

export namespace Account {
  export type Attributes = {
    email: string;
    externalId?: string;
    id?: string;
    createdAt?: string;
  }
}
