import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccountService } from '../../account/account.service';
import { jwtAccountInfoProtectConstants } from '../constants';

@Injectable()
export class AccountInfoProtectJwtStrategy extends PassportStrategy(
  Strategy,
  'account-info-protect-jwt',
) {
  constructor(private accountService: AccountService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtAccountInfoProtectConstants.secret,
    });
  }

  async validate(payload: any) {
    const existAccount = await this.accountService.findOne(payload.sub);
    if (!existAccount) {
      throw new Error('Invalid token');
    }
    return { ...payload, id: payload.sub };
  }
}
