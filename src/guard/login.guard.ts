import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { REQUIRE_LOGIN } from 'src/const/decorator';
import { Role } from 'src/user/entity/role.entity';

export interface JwtData {
  exp: number;
  username: string;
  roles: Role[];
}

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    const requireLogin = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_LOGIN,
      [context.getClass(), context.getHandler()],
    );

    if (!requireLogin) return true;

    if (!authorization) {
      throw new UnauthorizedException('authorization error');
    }

    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<JwtData>(token);
      if (data.exp > Date.now()) {
        throw new UnauthorizedException('authorization expired');
      }
      request.user = data;
      return true;
    } catch (err) {
      throw new UnauthorizedException('authorization error');
    }
  }
}
