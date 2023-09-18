import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import { Account } from '../account/entities/account.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { AuthService } from '../auth/auth.service';

type AccountWithoutPassword = Omit<Account, 'password'>;

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly authService: AuthService,
  ) {}

  async sendAccountConfirmation(account: AccountWithoutPassword) {
    await this.mailerService.sendMail({
      to: account.email,
      subject: 'Welcome to Nice App! Confirm Your Email',
      template: './template/confirmation', // 指向模板文件
      context: {
        // 模板变量
        name: account.username,
        email: account.email,
      },
    });
  }

  async sendResetPassword(account: AccountWithoutPassword) {
    await this.mailerService.sendMail({
      to: account.email,
      subject: 'Reset Password',
      template: './template/resetPassword', // 指向模板文件
      context: {
        // 模板变量
        name: account.username,
        code: this.authService.generateOTPForUpdateAccount(account.id),
      },
    });
  }

  create(createMailDto: CreateMailDto) {
    return 'This action adds a new mail';
  }

  findAll() {
    return `This action returns all mail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mail`;
  }

  update(id: number, updateMailDto: UpdateMailDto) {
    return `This action updates a #${id} mail`;
  }

  remove(id: number) {
    return `This action removes a #${id} mail`;
  }
}
