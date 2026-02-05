import { PrismaRole } from 'src/common/enums/role.enum';

export class AuthResponseDto {
  message: string | 'Request processed successfully';
  accessToken: string;
  refreshToken: string | null;
  user: {
    id: string;
    email: string | null;
    name: string | null;
    role: PrismaRole | null;
  };
}
