import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
import { IsJWT } from 'class-validator';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @IsJWT()
  updateAccountJwt: string;
}
