import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types';
import { getCurrentUserByContext } from './current-user.decorator';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = getCurrentUserByContext(context);
    const user = request.user as JwtPayload;
    return user.sub;
  },
);
