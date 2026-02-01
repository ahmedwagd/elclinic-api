import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { LoginDto } from './dto';
import { PrismaService } from 'src/database/prisma.service';
import { JwtPayload, Tokens } from 'src/common/types';

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
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    const data = {
      ...(await this.excludeUnnecessaryFields(user)),
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
    return data;
  }
  async logout(userId: string) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });
    return;
  }
  async refreshToken() {
    // TODO: Add logic to refresh access token using refresh token

    return null;
  }

  async validateUser(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        isActive: true,
      },
    });
    if (user && user.isActive) {
      return this.excludeUnnecessaryFields(user);
    }
    return null;
  }
  async validateJwtUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        isActive: true,
      },
    });
    if (user && user.isActive) {
      return this.excludeUnnecessaryFields(user);
    }
    return null;
  }

  async generateTokens(userId: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.getOrThrow('jwt.secret'),
        expiresIn: this.configService.getOrThrow('jwt.expiresIn'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.getOrThrow('jwt.refreshSecret'),
        expiresIn: this.configService.getOrThrow('jwt.refreshExpiresIn'),
      }),
    ]);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.prismaService.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }
  async excludeUnnecessaryFields(user: any) {
    const { password, createdAt, updatedAt, ...result } = user;
    return result;
  }
}
