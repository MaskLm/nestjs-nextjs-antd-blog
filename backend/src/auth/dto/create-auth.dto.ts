import { IsIP, IsJWT, IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  userAgent: string;
  //@IsIP(4, { message: 'IP must be a valid IPv4 address' })
  ipv4?: string;
  @IsJWT()
  refreshToken: string;
}
