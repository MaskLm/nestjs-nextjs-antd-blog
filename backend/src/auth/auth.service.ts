import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AccountService } from '../account/account.service';
import * as bcrypt from 'bcrypt';
import { Account } from '../account/entities/account.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtRefreshConstants } from './constants';
import { LoginAuthDto } from './dto/login-auth.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Auth } from './entities/auth.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';

type AccountWithoutPassword = Omit<Account, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
    private readonly em: EntityManager,
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
      throw new UnauthorizedException();
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

  async login(loginAuthDto: LoginAuthDto) {
    const account = await this.accountService.findByUsername(
      loginAuthDto.username,
    );
    if (!account) {
      throw new UnauthorizedException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...accountWithoutPassword } = account;
    const payload = {
      username: account.username,
      sub: account.id,
      role: account.role,
    };
    const refreshToken = this.generateRefreshToken(accountWithoutPassword);
    const createAuthDto: CreateAuthDto = {
      ...loginAuthDto,
      refreshToken,
    };
    await this.create(createAuthDto, account);
    return {
      account: payload,
      accessToken: this.generateAccessToken(accountWithoutPassword),
      refreshToken: refreshToken,
    };
  }

  async create(createAuthDto: CreateAuthDto, account: Account) {
    const auth: Auth = this.em.create('Auth', createAuthDto);
    auth.account = account;
    await this.em.persistAndFlush(auth);
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async update(accountId: number, updateAuthDto: UpdateAuthDto) {
    return null;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async findByRefreshToken(refreshToken: string) {
    const auth = await this.em.findOne('Auth', { refreshToken });
    if (!auth) throw new UnauthorizedException('Invalid refresh token');
    return auth;
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    try {
      const decodedToken = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
      );
      const account = await this.accountService.findOne(decodedToken.sub);
      if (!account) throw new UnauthorizedException('Invalid refresh token');
      const auth = await this.findByRefreshToken(refreshTokenDto.refreshToken);
      if (!auth) throw new UnauthorizedException('Invalid refresh token');
      return {
        accessToken: await this.generateAccessToken(account),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
