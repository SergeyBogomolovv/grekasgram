import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessTokenPayload } from 'src/tokens/dto/access-token.payload';

export const HttpUser = createParamDecorator(
  (key: keyof AccessTokenPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return key ? request.user?.[key] : request.user;
  },
);
