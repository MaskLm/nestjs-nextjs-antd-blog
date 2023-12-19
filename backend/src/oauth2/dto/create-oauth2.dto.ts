import { IsNumber, IsString } from 'class-validator';

export class CreateOauth2Dto {
  @IsString()
  accessToken: string;
  @IsString()
  refreshToken: string;
  @IsString()
  type: string;
  @IsString()
  openId: string;
  @IsNumber()
  account: number;
}
