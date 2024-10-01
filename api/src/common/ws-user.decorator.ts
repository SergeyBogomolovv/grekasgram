import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionPayload } from 'src/auth/entities/session';

export const WsUser = createParamDecorator(
  (key: keyof SessionPayload | undefined, context: ExecutionContext) => {
    const client = context.switchToWs().getClient();
    return key ? client.request.user?.[key] : client.request.user;
  },
);
