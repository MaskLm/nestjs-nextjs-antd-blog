import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Account } from './entities/account.entity';
import { UserService } from '../user/user.service';
import { Redis } from 'ioredis';
import { UpdateAccountByAdminDto } from './dto/update-account-byAdmin.dto';
import { FindAllAccountDto } from './dto/findAll-account.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly em: EntityManager,
    private readonly userService: UserService,
    @Inject('REDIS') private readonly redis: Redis,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    try {
      const account: Account = this.em.create('Account', createAccountDto);
      await this.em.persistAndFlush(account);
      await this.userService.create({
        email: createAccountDto.email,
        nickname: createAccountDto.username,
        account: account.id,
      });
      const { password, ...result } = account;
      return result;
    } catch (e) {
      if (e.name == 'UniqueConstraintViolationException') {
        throw new HttpException('Username or email already exists', 409);
      }
    }
  }

  async findByUsername(username: string) {
    try {
      const account = await this.em.findOneOrFail(Account, { username });
      if (account) {
        return account;
      }
      return null;
    } catch (e) {
      if (e.name == 'NotFoundError') {
        throw new HttpException('Account not found', 404);
      }
    }
  }

  async findByUsernameWithPassword(username: string) {
    try {
      const account = await this.em.findOneOrFail(Account, { username });
      await this.em.populate(account, ['password']);
      if (account) {
        return account;
      }
      return null;
    } catch (e) {
      if (e.name == 'NotFoundError') {
        throw new HttpException('Account not found', 404);
      }
    }
  }

  async findByEmail(email: string) {
    try {
      const account = await this.em.findOneOrFail(Account, { email });
      if (account) {
        return account;
      }
      return null;
    } catch (e) {
      if (e.name == 'NotFoundError') {
        throw new HttpException('Account not found', 404);
      }
    }
  }

  async findByEmailWithoutError(email: string) {
    const account = await this.em.findOne(Account, { email });
    if (account) {
      return account;
    }
    return null;
  }

  async findAll(findAllAccountDto: FindAllAccountDto) {
    const qb = this.em.createQueryBuilder(Account, 'account');
    qb.orderBy({
      [findAllAccountDto.sortField || 'createdAt']:
        findAllAccountDto.sortOrder === 'ascend' ? 'ASC' : 'DESC',
    });
    qb.offset((findAllAccountDto.current - 1) * findAllAccountDto.pageSize);
    qb.limit(findAllAccountDto.pageSize);
    qb.where({ deletedAt: null });
    if (findAllAccountDto.filters) {
      Object.entries(findAllAccountDto.filters).forEach(([key, value]) => {
        qb.andWhere({ [key]: { $like: `%${value}%` } });
      });
    }
    let items: any = await qb.getResult();
    items = await Promise.all(
      items.map(
        async (item: { id: number; username: any; email: any; role: any }) => {
          const nickname = await this.userService.getNickname(item.id);
          return {
            nickname,
            id: item.id,
            username: item.username,
            email: item.email,
            role: item.role,
          };
        },
      ),
    );
    return items;
  }

  async findOne(id: number) {
    const account: Account = await this.em.findOne(Account, {
      id,
      deletedAt: null,
    });
    await this.em.populate(account, ['password']);

    if (account) {
      return account;
    } else {
      throw new Error('Account not found');
    }
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    if ('username' in updateAccountDto) {
      throw new BadRequestException('Username cannot be changed.');
    }
    if ('updateAccountJwt' in updateAccountDto) {
      const jwt = await this.redis.get(`auth:updateAccountToken:${id}`);
      if (jwt !== updateAccountDto.updateAccountJwt)
        throw new UnauthorizedException('Invalid Update Account JWT');
      else {
        const account = await this.em.findOneOrFail(Account, {
          id,
          deletedAt: null,
        });
        if (account) {
          const updatedAccount = this.em.assign(account, updateAccountDto);
          await this.em.persistAndFlush(updatedAccount);
          await this.redis.del(`auth:updateAccountToken:${id}`);
          return updatedAccount;
        }
      }
    }
    throw new UnauthorizedException();
  }

  async updateByAdmin(id: number, updateAccountDto: UpdateAccountByAdminDto) {
    if ('username' in updateAccountDto) {
      throw new BadRequestException('Username cannot be changed.');
    }
    const account = await this.em.findOneOrFail(Account, {
      id,
      deletedAt: null,
    });
    if (account) {
      const updatedAccount = this.em.assign(account, updateAccountDto);
      await this.em.persistAndFlush(updatedAccount);
      return updatedAccount;
    }
  }
  async remove(id: number) {
    const account = await this.em.findOneOrFail(Account, id);
    account.user.deletedAt = new Date();
    account.deletedAt = new Date();
    await this.em.persistAndFlush(account);
  }
}
