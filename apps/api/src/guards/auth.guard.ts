import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserRole } from '../common/common.enum';
import authConfig from '../common/configs/auth.config';
import { TokenPayload } from '../common/type';
import keyLogout from '../helper/keyLogout';

const PUBLIC_METADATA_KEY = 'PUBLIC';
const ROLE_METADATA_KEY = 'ROLES';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(Reflector) private reflector: Reflector,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (this.reflector.get(PUBLIC_METADATA_KEY, context.getHandler()))
      return true;
    return this.validateRequest(
      request,
      this.reflector.get<UserRole[]>(ROLE_METADATA_KEY, context.getHandler())
    );
  }

  private async validateRequest(
    request: Request,
    acceptedRoles: UserRole[]
  ): Promise<boolean> {
    try {
      let token = request.headers.authorization;
      if (!token) {
        throw new UnauthorizedException('Token not found');
      }
      token = token.replace('Bearer ', '');
      request.headers['authorization'] = token;

      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret: authConfig.jwtConstants.secretKeyToken,
      });

      const { role } = payload;

      if (
        acceptedRoles &&
        !acceptedRoles.some((r) => r === role) &&
        acceptedRoles.length !== 0
      ) {
        throw new ForbiddenException(
          `Role ${payload.role.toLocaleLowerCase()} cannot access`
        );
      }
      if (await this.cacheManager.get(keyLogout(payload.jti))) {
        throw new UnauthorizedException('Token is revoked');
      }
      return true;
    } catch (e) {
      if (e.status) {
        throw new HttpException(e.message, e.status);
      }
      throw new UnauthorizedException(e.message);
    }
  }
}

export const Public = () => SetMetadata(PUBLIC_METADATA_KEY, true);
export const Roles = (...roles: string[]) => {
  return SetMetadata(ROLE_METADATA_KEY, roles);
};
