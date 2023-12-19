import { Controller, Get, Query } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public } from '../auth/decorator/public-decorator';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  // @Post()
  // create(@Body() createMailDto: CreateMailDto) {
  //   return this.mailService.create(createMailDto);
  // }

  // @Get()
  // findAll() {
  //   return this.mailService.findAll();
  // }

  @Public()
  @Get('sendResetPassword')
  sendResetPassword(@Query('email') email: string) {
    return this.mailService.sendResetPassword(email);
  }
}
