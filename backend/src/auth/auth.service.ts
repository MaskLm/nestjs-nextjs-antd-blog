import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AccountService } from '../account/account.service';
import * as bcrypt from 'bcrypt';
import { Account } from '../account/entities/account.entity';
import { JwtService } from '@nestjs/jwt';
import {
  jwtAccessConstants,
  jwtAccountInfoProtectConstants,
  jwtRefreshConstants,
} from './constants';
import { LoginAuthDto } from './dto/login-auth.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { Auth } from './entities/auth.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { generate } from 'otp-generator';
import { Redis } from 'ioredis';
import { Oauth2LoginDto } from './dto/oauth2-auth.dto';

type AccountWithoutPassword = Omit<Account, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
    private readonly em: EntityManager,
    @Inject('REDIS') private readonly redis: Redis,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const existUser = await this.accountService.findByUsernameWithPassword(
      username,
    );
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
    return this.jwtService.sign(payload, {
      secret: jwtAccessConstants.secret,
      expiresIn: jwtAccessConstants.expiresIn,
    });
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

  async oauth2Login(oauth2LoginDto: Oauth2LoginDto) {
    //   `oauth2:${accountId}:${type}:${openId}`,
    const parts = (await this.redis.get(oauth2LoginDto.token)).split(':');
    const account = await this.accountService.findOne(+parts[1]);
    if (!account) throw new UnauthorizedException();
    const payload = {
      username: account.username,
      sub: account.id,
      role: account.role,
    };
    const refreshToken = this.generateRefreshToken(account);
    const accessToken = this.generateAccessToken(account);
    return {
      account: payload,
      accessToken,
      refreshToken,
    };
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
    await this.create(createAuthDto, account.id);
    return {
      account: payload,
      accessToken: this.generateAccessToken(accountWithoutPassword),
      refreshToken: refreshToken,
    };
  }

  async create(createAuthDto: CreateAuthDto, accountId: number) {
    const account: Account = await this.accountService.findOne(accountId);
    const auth: Auth = await this.em.findOne('Auth', {
      userAgent: createAuthDto.userAgent,
      account,
    });
    if (auth) {
      auth.userAgent = createAuthDto.userAgent;
      auth.refreshToken = createAuthDto.refreshToken;
      auth.ipv4 = createAuthDto.ipv4;
      await this.em.persistAndFlush(auth);
    } else {
      const authNew: Auth = this.em.create('Auth', createAuthDto);
      authNew.account = account;
      await this.em.persistAndFlush(authNew);
    }
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
        {
          secret: jwtRefreshConstants.secret,
        },
      );
      const account = await this.accountService.findOne(decodedToken.sub);
      if (!account) throw new UnauthorizedException('Invalid refresh token');
      const auth = await this.findByRefreshToken(refreshTokenDto.refreshToken);
      if (!auth) throw new UnauthorizedException('Invalid refresh token');
      return {
        accessToken: this.generateAccessToken(account),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async generateUpdateAccountToken(account: AccountWithoutPassword) {
    const payload = {
      username: account.username,
      sub: account.id,
      role: account.role,
    };
    const token = this.jwtService.sign(payload, {
      secret: jwtAccountInfoProtectConstants.secret,
      expiresIn: jwtAccountInfoProtectConstants.expiresIn,
    });
    this.redis.set(
      `auth:updateAccountToken:${account.id}`,
      token,
      'EX',
      60 * 5,
    );
    return { id: account.id, token };
  }

  async getUpdateAccountTokenByOldPassword(id: number, oldPassword: string) {
    const existUser = await this.accountService.findOne(id);
    const isMatch = await bcrypt.compare(oldPassword, existUser.password);
    if (isMatch) {
      return await this.generateUpdateAccountToken(existUser);
    } else {
      throw new UnauthorizedException('Invalid old password');
    }
  }

  async generateOTPForUpdateAccount(id: number) {
    const otp = generate(6, { upperCaseAlphabets: false, specialChars: false });
    this.redis.set(`auth:updateAccountOTP:${id}`, otp, 'EX', 60 * 5);
    return otp;
  }

  async getUpdateAccountTokenByOTP(email: string, otp: string) {
    const account = await this.accountService.findByEmail(email);
    const existOTP = await this.redis.get(
      `auth:updateAccountOTP:${account.id}`,
    );
    if (!existOTP) throw new UnauthorizedException('OTP is expired or error');
    if (existOTP === otp) {
      await this.redis.del(`auth:updateAccountOTP:${account.id}`);
      return await this.generateUpdateAccountToken(account);
    }
  }
}
