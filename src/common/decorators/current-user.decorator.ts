import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadWithRt } from '../types';

export const getCurrentUserByContext = (context: ExecutionContext) =>
  context.switchToHttp().getRequest().user;

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, ctx: ExecutionContext) => {
    const user = getCurrentUserByContext(ctx);

    return data ? user?.[data] : user;
  },
);
