import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Account } from './entities/account.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccountService {
  constructor(
    private readonly em: EntityManager,
    private readonly userService: UserService,
    private jwtService: JwtService,
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

  async decodeToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    if ('username' in updateAccountDto) {
      throw new BadRequestException('Username cannot be changed.');
    }
    if ('updateAccountJwt' in updateAccountDto) {
      const decodedJwt = await this.decodeToken(
        updateAccountDto.updateAccountJwt,
      );
      if (!decodedJwt) throw new UnauthorizedException();
      else {
        const id = decodedJwt.sub;
        const account = await this.em.findOne(Account, { id, deletedAt: null });
        if (account) {
          const updatedAccount = this.em.assign(account, updateAccountDto);
          await this.em.persistAndFlush(updatedAccount);
          return updatedAccount;
        }
      }
    }
    throw new UnauthorizedException();
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
