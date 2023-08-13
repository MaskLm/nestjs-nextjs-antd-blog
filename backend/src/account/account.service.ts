import { HttpException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(private readonly em: EntityManager) {}

  async create(createAccountDto: CreateAccountDto) {
    try {
      const account: Account = this.em.create('Account', createAccountDto);
      await this.em.persistAndFlush(account);
      const { password, ...result } = account;
      return result;
    } catch (e) {
      if (e.name == 'UniqueConstraintViolationException') {
        throw new HttpException('Username or email already exists', 409);
      }
    }
  }

  async findByUsername(username: string) {
    const account = await this.em.findOne(Account, { username });
    if (account) {
      return account;
    }
    return null;
  }

  findAll() {
    return `This action returns all account`;
  }

  findOne(id: number) {
    const account = this.em.findOne(Account, { id, deletedAt: null });
    if (account) {
      return account;
    } else {
      throw new Error('Account not found');
    }
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
