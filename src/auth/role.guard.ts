import {
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import jwt_decode from 'jwt-decode';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class RoleGuard extends JwtAuthGuard {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const passportActivate = super.canActivate(context);
    console.log({ passes: passportActivate });
    if (!passportActivate) {
      throw new HttpException(
        'You do not have permission (Roles)',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const requireRoles = this.reflector.getAllAndOverride<string[]>('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = jwt_decode(request.headers.authorization);
    if (requireRoles === token['userRole']) {
      return true;
    } else {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['권한이 없습니다.'],
        error: 'Forbidden',
      });
    }
  }
}
