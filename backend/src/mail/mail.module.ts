import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AuthModule } from '../auth/auth.module';
import { AccountModule } from '../account/account.module';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [
    AuthModule,
    AccountModule,
    MailerModule.forRoot({
      transport: process.env.MAIL_TRANSPORT,
      template: {
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      defaults: {
        from: `"${process.env.MAIL_NAME}" <${process.env.MAIL_ADDRESS}>`,
      },
    }),
  ],
})
export class MailModule {}
