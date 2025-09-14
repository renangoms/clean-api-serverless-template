import { Account } from '@application/entities/Account';
import { Injectable } from '@kernel/decorators/Injectable';
import { eq } from 'drizzle-orm';
import { db } from '../drizzle';
import { accountsTable } from '../drizzle/schema';

@Injectable()
export class AccountRepository {
  async findByEmail(email: string): Promise<Account | null> {
    const account = await db.query.accountsTable.findFirst({
      where: eq(accountsTable.email, email),
    });

    if (!account) {
      return null;
    }

    return account;
  }

  async create(account: Account): Promise<void> {
    await db.insert(accountsTable).values(account);
  }
}
