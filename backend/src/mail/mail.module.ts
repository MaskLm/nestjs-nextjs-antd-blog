import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import * as process from 'process';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [
    AuthModule,
    MailerModule.forRoot({
      transport: process.env.MAIL_TRANSPORT,
      template: {
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class MailModule {}
