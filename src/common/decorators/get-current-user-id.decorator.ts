import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types';
import { getCurrentUserByContext } from './current-user.decorator';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const user = getCurrentUserByContext(context) as JwtPayload;
    return user.sub;
  },
);
