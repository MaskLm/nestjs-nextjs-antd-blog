import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { Oauth2Service } from './oauth2.service';
import { CreateOauth2Dto } from './dto/create-oauth2.dto';
import { UpdateOauth2Dto } from './dto/update-oauth2.dto';
import { Public } from '../auth/decorator/public-decorator';

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
  googleCallback(@Query('error') error?: string, @Query('code') code?: string) {
    if (error) throw new UnauthorizedException(error);
    if (code) return this.oauth2Service.googleCallback(code);
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOauth2Dto: UpdateOauth2Dto) {
    return this.oauth2Service.update(+id, updateOauth2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.oauth2Service.remove(+id);
  }
}
