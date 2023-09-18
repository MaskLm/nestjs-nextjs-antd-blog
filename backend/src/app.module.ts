import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth-guard';
import { BlogModule } from './blog/blog.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { RedisModule } from './RedisModule';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    AccountModule,
    AuthModule,
    BlogModule,
    UserModule,
    MailModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
