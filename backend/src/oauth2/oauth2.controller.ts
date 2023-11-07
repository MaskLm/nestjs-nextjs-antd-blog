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
        process.env.FRONTEND_URL + '/oauth2/google/callback?token=' + ans,
      );
    }
  }

  @Post()
  create(@Body() createOauth2Dto: CreateOauth2Dto) {
    return this.oauth2Service.create(createOauth2Dto);
  }

  @Get()
  findAll() {
    return this.oauth2Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.oauth2Service.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.oauth2Service.remove(+id);
  }
}
