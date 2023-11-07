import { IsJWT, IsNumber, IsString } from 'class-validator';

export class CreateOauth2Dto {
  @IsJWT()
  accessToken: string;
  @IsJWT()
  refreshToken: string;
  @IsString()
  type: string;
  @IsString()
  openId: string;
  @IsNumber()
  accountId: number;
}
