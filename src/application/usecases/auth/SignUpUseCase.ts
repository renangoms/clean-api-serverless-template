import { Account } from '@application/entities/Account';
import { EmailAlreadyInUse } from '@application/errors/application/EmailAlreadyInUse';
import { Injectable } from '@kernel/decorators/Injectable';
import { AccountRepository } from 'src/infra/database/repositories/AccountRepository';

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
  ) { }

  async execute({
    account: {
      email,
    },
  }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    const emailAlreadyInUse = await this.accountRepository.findByEmail(email);

    if (emailAlreadyInUse) {
      throw new EmailAlreadyInUse();
    }

    const account = new Account({
      email,
    });

    await this.accountRepository.create(account);

    return {
      accessToken: account.id,
      refreshToken: 'refreshToken',
    };
  }
}

export namespace SignUpUseCase {
  export type Input = {
    account: {
      email: string;
      password: string;
    },
  }
  export type Output = {
    accessToken: string;
    refreshToken: string;
  }
}
