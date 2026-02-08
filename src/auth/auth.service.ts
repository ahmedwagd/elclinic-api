import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaRole } from 'src/common/enums/role.enum';
import { JwtPayload, Tokens } from 'src/common/types';
import { UsersService } from 'src/users/users.service';
import { ChangePasswordDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async logIn(userId: string, role: PrismaRole) {
    const { accessToken, refreshToken } = await this.generateTokens(
      userId,
      role,
    );
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
    const user = await this.userService.findById(userId);
    return {
      id: userId,
      email: user?.email,
      name: user?.name,
      role: user?.role,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    const user = await this.userService.findById(userId);

    if (!user?.hashedRefreshToken)
      throw new UnauthorizedException('User already logged out');

    await this.userService.updateHashedRefreshToken(userId, null);
    return null;
  }

  async getMe(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    if (user.hashedRefreshToken === null)
      throw new UnauthorizedException('User already logged out');
    return {
      id: userId,
      email: user?.email,
      name: user?.name,
      role: user?.role,
    };
  }

  async changePassword(userId: any, changePasswordDto: ChangePasswordDto) {
    console.log('AuthService.changePassword called for userId:', userId);
    const { oldPassword, newPassword } = changePasswordDto;
    const user = await this.userService.findById(userId);
    if (!user) {
      console.log('User not found for userId:', userId);
      throw new UnauthorizedException('User not found!');
    }
    // check old password matches
    const storedPassword = await this.userService.getUserPassword(userId);
    if (!storedPassword) {
      console.log('Stored password not found for userId:', userId);
      throw new UnauthorizedException('User password not found!');
    }

    const passwordMatches = await argon2.verify(storedPassword, oldPassword);
    if (!passwordMatches) {
      console.log('Password mismatch for userId:', userId);
      throw new UnauthorizedException('Invalid Old Password');
    }
    const hashedPassword = await argon2.hash(newPassword);
    await this.userService.updateHashedPassword(userId, hashedPassword);
    return {
      message: 'Change password success',
    };
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user?.hashedRefreshToken)
      throw new UnauthorizedException('Invalid Refresh Token');

    const refreshTokenMatches = await argon2.verify(
      user?.hashedRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches)
      throw new UnauthorizedException('Invalid Refresh Token');

    return {
      id: userId,
      role: user.role,
      email: user.email,
      name: user.name,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmailWithPassword(email);
    if (!user || !user?.password)
      throw new UnauthorizedException('User not found!');
    const isPasswordMatch = await argon2.verify(user?.password, password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid credentials');

    return { id: user?.id, role: user?.role };
  }

  async generateTokens(userId: string, role: PrismaRole): Promise<Tokens> {
    const jwtPayload: JwtPayload = { sub: userId, role };

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

    return { accessToken, refreshToken };
  }

  async refreshToken(userId: string, role: PrismaRole) {
    const { accessToken, refreshToken } = await this.generateTokens(
      userId,
      role,
    );
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  }
}
