import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async logIn(@CurrentUser() user: any): Promise<AuthResponseDto> {
    const userId = user.id;
    const data = await this.authService.logIn(userId);

    const results: AuthResponseDto = {
      message: 'Login success',
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: {
        id: user.id,
        email: data.email,
        name: data.name,
        role: data.role,
      },
    };

    return results;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logOut(@CurrentUser() user: any) {
    const userId = user.id;
    const data = await this.authService.logout(userId);
    const results = {
      message: 'Logout success',
    };
    return results;
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshAuthGuard)
  async refreshToken(@CurrentUser() user: any): Promise<AuthResponseDto> {
    const userId = user.id;
    const data = await this.authService.refreshToken(userId);
    const results: AuthResponseDto = {
      message: 'Refresh token success',
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };

    return results;
  }
}
