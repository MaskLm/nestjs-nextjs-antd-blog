import {
  HttpException,
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
import axios from 'axios';
import { Octokit } from 'octokit';

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

  async githubCallback(code: string, state: string) {
    const stateExist = await this.redis.get(state);
    if (!stateExist) throw new UnauthorizedException('state not exist');
    try {
      const res = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );
      const access_token = res.data.access_token;
      const octokit = new Octokit({ auth: access_token });
      const userInfo = await octokit.request('GET /user');
      const email: string =
        userInfo.data.email ||
        (
          await octokit.request('GET /user/emails', {
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          })
        ).data.find((email) => email.primary === true).email;
      const ans = await this.handleOauth2Data(
        userInfo.data.avatar_url,
        email,
        userInfo.data.id.toString(),
        {
          refresh_token: access_token,
          access_token: access_token,
        },
        'github',
      );
      return ans;
    } catch (e) {
      throw new HttpException('Some Error', 400, {
        cause: new Error(e),
      });
    }
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
      const account = await this.accountService.findByEmailWithoutError(email);
      let accountId = -1;
      if (oauth2) {
        oauth2.accessToken = tokens.access_token;
        oauth2.refreshToken = tokens.refresh_token;
        accountId = oauth2.account.id;
        await this.em.persistAndFlush(oauth2);
      } else if (!oauth2 && account) {
        await this.create({
          openId,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          type: type,
          account: account.id,
        });
        accountId = account.id;
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
          account: account.id,
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
    try {
      const oauth2 = this.em.create('Oauth2', createOauth2Dto);
      await this.em.persistAndFlush(oauth2);
    } catch (e) {
      console.error(e);
    }
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

  async setState(state: string) {
    await this.redis.set(state, `true`, 'EX', 360);
  }
}
