import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Oauth2Service } from './oauth2.service';
import { CreateOauth2Dto } from './dto/create-oauth2.dto';
import { UpdateOauth2Dto } from './dto/update-oauth2.dto';
import { Public } from '../auth/decorator/public-decorator';
import { Response } from 'express';

@Controller('oauth2')
export class Oauth2Controller {
  constructor(private readonly oauth2Service: Oauth2Service) {}

  @Public()
  @Get('getGoogleAuthorizationURL')
  getGoogleAuthorizationURL() {
    return this.oauth2Service.getGoogleAuthorizationURL();
  }

  @Public()
  @Get('google/callback')
  async googleCallback(
    @Res() res: Response,
    @Query('error') error?: string,
    @Query('code') code?: string,
  ) {
    if (error) throw new UnauthorizedException(error);
    if (code) {
      const ans = await this.oauth2Service.googleCallback(code);
      return res.redirect(
        process.env.FRONTEND_URL + '/oauth2/callback?token=' + ans,
      );
    }
  }

  @Public()
  @Get('github/callback')
  async githubCallback(
    @Res() res: Response,
    @Query('error') error?: string,
    @Query('code') code?: string,
    @Query('state') state?: string,
  ) {
    if (error) throw new UnauthorizedException(error);
    if (code) {
      const ans = await this.oauth2Service.githubCallback(code, state);
      return res.redirect(
        process.env.FRONTEND_URL + '/oauth2/callback?token=' + ans,
      );
    }
  }

  @Public()
  @Get('state')
  async setState(@Query('state') state: string) {
    return await this.oauth2Service.setState(state);
  }
}
