import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { UserService } from '../user/user.service';

@Module({
  controllers: [AccountController],
  providers: [AccountService, UserService],
  exports: [AccountService],
})
export class AccountModule {}
