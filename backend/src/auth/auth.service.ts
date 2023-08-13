import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AccountService } from '../account/account.service';
import * as bcrypt from 'bcrypt';
import { Account } from '../account/entities/account.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtRefreshConstants } from './constants';

type AccountWithoutPassword = Omit<Account, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const existUser = await this.accountService.findByUsername(username);
    if (existUser) {
      const isMatch = await bcrypt.compare(password, existUser.password);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: ignorePassword, ...result } = existUser;
        return result;
      } else return null;
    } else {
      throw new Error('User not found');
    }
  }

  generateAccessToken(account: AccountWithoutPassword) {
    const payload = {
      username: account.username,
      sub: account.id,
      role: account.role,
    };
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(account: AccountWithoutPassword) {
    const payload = {
      username: account.username,
      sub: account.id,
      role: account.role,
    };
    return this.jwtService.sign(payload, {
      secret: jwtRefreshConstants.secret,
      expiresIn: jwtRefreshConstants.expiresIn,
    });
  }

  async login(account: Account) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...accountWithoutPassword } = account;
    const payload = {
      username: account.username,
      sub: account.id,
      role: account.role,
    };
    return {
      user: payload,
      access_token: this.generateAccessToken(accountWithoutPassword),
      refresh_token: this.generateRefreshToken(accountWithoutPassword),
    };
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
