import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOauth2Dto } from './dto/create-oauth2.dto';
import { google } from 'googleapis';
import { EntityManager } from '@mikro-orm/postgresql';
import { AccountService } from 'src/account/account.service';
import { UserService } from 'src/user/user.service';
import { Oauth2 } from './entities/oauth2.entity';
import Redis from 'ioredis';

@Injectable()
export class Oauth2Service {
  constructor(
    private readonly em: EntityManager,
    private readonly accountService: AccountService,
    private readonly userService: UserService,
    @Inject('REDIS') private readonly redis: Redis,
  ) {}
  getGoogleAuthorizationURL() {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.BACKEND_URL + '/oauth2/google/oauth2callback',
    );

    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'OpenID',
    ];

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      include_granted_scopes: true,
    });
  }
  async googleCallback(code: string): Promise<string> {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.BACKEND_URL + '/oauth2/google/oauth2callback',
      );
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      const ticket = await oauth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!!tokens.access_token && !!tokens.refresh_token) {
        //读取用户信息
        const userInfo = await google.oauth2('v2').userinfo.get({
          auth: oauth2Client,
        });
        const ans = await this.handleOauth2Data(
          userInfo.data.picture,
          userInfo.data.email,
          payload.sub,
          tokens as { refresh_token: string; access_token: string },
          'google',
        );
        return ans;
      } else throw new Error('googleCallback: No tokens');
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }

  async handleOauth2Data(
    avatarURL: string,
    email: string,
    openId: string,
    tokens: {
      refresh_token: string;
      access_token: string;
    },
    type: string,
  ) {
    try {
      const oauth2: Oauth2 = await this.em.findOne('Oauth2', { openId, type });
      let accountId = -1;
      if (oauth2) {
        oauth2.accessToken = tokens.access_token;
        oauth2.refreshToken = tokens.refresh_token;
        accountId = oauth2.account.id;
        await this.em.persistAndFlush(oauth2);
      } else {
        const account = await this.accountService.create({
          username: openId,
          password: await this.generateRandomString(16),
          email: email,
        });
        accountId = account.id;
        await this.userService.update(account.id, {
          avatarURL: avatarURL,
        });
        await this.create({
          openId,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          type: type,
          accountId: account.id,
        });
      }
      return await this.generateToken(openId, type, accountId);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async generateToken(openId: string, type: string, accountId: number) {
    const token = await this.generateRandomString(32);
    await this.redis.set(
      token,
      `oauth2:${accountId}:${type}:${openId}`,
      'EX',
      60,
    );
    return token;
  }

  async create(createOauth2Dto: CreateOauth2Dto) {
    const oauth2 = this.em.create('Oauth2', createOauth2Dto);
    await this.em.persistAndFlush(oauth2);
  }

  findAll(): string {
    return `This action returns all oauth2`;
  }

  async findOne(id: number) {
    const oauth2 = await this.em.findOne('Oauth2', id);
    return oauth2;
  }

  async findOneByOpenId(openId: string): Promise<Oauth2 | null> {
    const oauth2 = (await this.em.findOne('Oauth2', { openId })) as Oauth2;
    return oauth2 ?? null;
  }

  remove(id: number) {
    return `This action removes a #${id} oauth2`;
  }

  async generateRandomString(length: number): Promise<string> {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
