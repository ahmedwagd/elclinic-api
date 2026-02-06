import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  LocalAuthGuard,
  RefreshAuthGuard,
} from '../common/guards';
import { AuthService } from './auth.service';
import { CurrentUser, Public } from 'src/common/decorators';
import { AuthResponseDto } from './dto';
import { SkipThrottle } from '@nestjs/throttler';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipThrottle()
  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async logIn(
    @CurrentUser() user: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const userId = user.id;
    const data = await this.authService.logIn(userId);
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: false, // خليها false في local dev
      sameSite: 'strict',
      path: '/auth/refresh',
    });
    const results: AuthResponseDto = {
      message: 'Login success',
      accessToken: data.accessToken,
      refreshToken: null,
      user: {
        id: user?.id || null,
        email: data?.email || null,
        name: data?.name || null,
        role: data?.role || null,
      },
    };

    return results;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logOut(
    @CurrentUser() user: any,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = user.id;
    // const refreshToken = req.cookies['refreshToken'];
    const data = await this.authService.logout(userId);
    res.clearCookie('refreshToken', { path: '/auth/refresh' });
    const results = {
      message: 'Logout success',
    };
    return results;
  }

  @SkipThrottle()
  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshAuthGuard)
  async refreshToken(
    @CurrentUser() user: any,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const userId = user.id;
    const data = await this.authService.refreshToken(userId);
    // const refreshToken = req.cookies['refreshToken'];
    // if (!refreshToken) {
    //   throw new UnauthorizedException();
    // }
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: false, // خليها false في local dev
      sameSite: 'strict',
      path: '/auth/refresh',
    });
    const results: AuthResponseDto = {
      message: 'Refresh token success',
      accessToken: data.accessToken,
      refreshToken: null,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };

    return results;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: any) {
    const userId = user.id;
    const data = await this.authService.getMe(userId);
    const results = {
      message: 'Get user success',
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
      },
    };
    return results;
  }
}
