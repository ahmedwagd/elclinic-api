import { Role } from 'src/common/enums/role.enum';
export type JwtPayload = {
  sub: string;
  role: Role;
};
