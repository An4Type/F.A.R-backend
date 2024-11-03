import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserData = createParamDecorator(
  (data: string | undefined, exec: ExecutionContext) => {
    const req = exec.switchToHttp().getRequest();

    if (req.user) return data ? req.user[data] : req.user;

    return null;
  },
);
