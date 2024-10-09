import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionEntity } from 'src/sessions/entities/session.entity';

export const WsSession = createParamDecorator(
  (key: keyof SessionEntity | undefined, context: ExecutionContext) => {
    const client = context.switchToWs().getClient();
    return key ? client.request.session?.[key] : client.request.session;
  },
);
