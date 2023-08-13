import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtAccessConstants } from '../constants';
import { AccountService } from '../../account/account.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private accountService: AccountService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtAccessConstants.secret,
    });
  }

  async validate(payload: any) {
    const existAccount = await this.accountService.findOne(payload.sub);
    if (!existAccount) {
      throw new UnauthorizedException('Invalid token');
    }
    return { ...payload, id: payload.sub };
  }
}