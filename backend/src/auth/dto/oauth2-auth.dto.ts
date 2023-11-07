import { IsNotEmpty, IsString } from 'class-validator';

export class Oauth2LoginDto {
  @IsString()
  @IsNotEmpty()
  token: string;
  @IsString()
  @IsNotEmpty()
  userAgent: string;
  ipv4?: string;
}
