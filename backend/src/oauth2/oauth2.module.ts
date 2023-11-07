import { Module } from '@nestjs/common';
import { Oauth2Service } from './oauth2.service';
import { Oauth2Controller } from './oauth2.controller';
import { AccountModule } from 'src/account/account.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [Oauth2Controller],
  providers: [Oauth2Service],
  imports: [AccountModule, UserModule],
})
export class Oauth2Module {}
