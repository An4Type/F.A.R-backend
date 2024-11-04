import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = AuthGuard.extractTokenFromRequest(req);

    if (!token) throw new UnauthorizedException();

    const userPayload: any = jwt.verify(token, process.env.JWT_PASS);
    const user = await this.userService.findById(userPayload.id);

    if (!user)
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);

    req.user = user;
    return true;
  }

  static extractTokenFromRequest(req: Request) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === AuthGuard.authType.Bearer ? token : undefined;
  }

  static authType = {
    Bearer: 'Bearer',
  };
}
