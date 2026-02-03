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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  logIn(@CurrentUser() user: any) {
    const userId = user.id;
    const data = this.authService.logIn(userId);

    const results = {
      message: 'Login successful',
      results: data,
    };

    return results;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  logOut(@CurrentUser() user: any) {
    const userId = user.id;
    const data = this.authService.logout(userId);
    const results = {
      message: 'Logout successful',
      data,
    };

    return results;
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshAuthGuard)
  refreshToken(@CurrentUser() user: any) {
    const userId = user.id;
    const data = this.authService.refreshToken(userId);
    const results = {
      message: 'Refresh token successful',
      // results: data,
    };

    return results;
  }
}
