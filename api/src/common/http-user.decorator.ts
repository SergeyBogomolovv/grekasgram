import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionPayload } from 'src/auth/entities/session';

export const HttpUser = createParamDecorator(
  (key: keyof SessionPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return key ? request.user?.[key] : request.user;
  },
);
