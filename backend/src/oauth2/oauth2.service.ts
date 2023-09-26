import { Injectable } from '@nestjs/common';
import { CreateOauth2Dto } from './dto/create-oauth2.dto';
import { UpdateOauth2Dto } from './dto/update-oauth2.dto';
import { google } from 'googleapis';

@Injectable()
export class Oauth2Service {
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
  async googleCallback(code: string) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.BACKEND_URL + '/oauth2/google/oauth2callback',
    );
    const tokens = await oauth2Client.getToken(code);
    //TODO write tokens in db
    //TODO generation a token for frontend to get app token
  }
  create(createOauth2Dto: CreateOauth2Dto) {
    return 'This action adds a new oauth2';
  }

  findAll() {
    return `This action returns all oauth2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} oauth2`;
  }

  update(id: number, updateOauth2Dto: UpdateOauth2Dto) {
    return `This action updates a #${id} oauth2`;
  }

  remove(id: number) {
    return `This action removes a #${id} oauth2`;
  }
}
