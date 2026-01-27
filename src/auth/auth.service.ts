import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { LoginDto } from './dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}
  async logIn(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);
    // await this.updateRefreshToken(user.id, tokens.refreshToken);
    const data = {
      ...(await this.excludeUnnecessaryFields(user)),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
    return data;
  }
  async logout() {
    // TODO: Add logic to clear access token and refresh token from cookies

    return '';
  }
  async refreshToken() {
    // TODO: Add logic to refresh access token using refresh token

    return '';
  }

  async validateUser(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (
      user &&
      user.isActive &&
      (await argon2.verify(user.password, password))
    ) {
      return this.excludeUnnecessaryFields(user);
    }
    return null;
  }

  async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('jwt.secret'),
        expiresIn: this.configService.getOrThrow('jwt.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('jwt.refreshSecret'),
        expiresIn: this.configService.getOrThrow('jwt.refreshExpiresIn'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
  async excludeUnnecessaryFields(user: any) {
    const { password, hashedRefreshToken, createdAt, updatedAt, ...result } =
      user;
    return result;
  }
}
