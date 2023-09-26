import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [UserModule],
  exports: [AccountService],
})
export class AccountModule {}
