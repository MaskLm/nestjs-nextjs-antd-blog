import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('You are not authenticated');
    }

    const hasRole = user.role.some((r) => roles.includes(r));
    if (!hasRole) {
      console.log(hasRole);
      throw new UnauthorizedException('You do not have permissions');
    }

    return true;
  }
}
