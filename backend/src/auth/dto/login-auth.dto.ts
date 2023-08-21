import { IsIP, IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  userAgent: string;
  //@IsIP(4, { message: 'IP must be a valid IPv4 address' })
  ipv4?: string;
}
