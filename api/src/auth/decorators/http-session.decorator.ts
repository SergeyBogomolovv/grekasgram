import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SessionEntity } from 'src/sessions/entities/session.entity';

export const HttpSession = createParamDecorator(
  (key: keyof SessionEntity | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return key ? request.session?.[key] : request.session;
  },
);
