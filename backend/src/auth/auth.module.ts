import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountModule } from '../account/account.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtAccessConstants } from './constants';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtService],
  imports: [
    AccountModule,
    PassportModule,
    JwtModule.register({
      secret: jwtAccessConstants.secret,
      signOptions: { expiresIn: jwtAccessConstants.expiresIn },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
