import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard, LocalAuthGuard } from '../common/guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logIn(@Body() loginDto: LoginDto) {
    const data = await this.authService.logIn(loginDto);

    const results = {
      message: 'Login successful',
      results: data,
    };

    return results;
  }
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: any) {
    const userId = user.id;
    const data = await this.authService.logout(userId);
    const results = {
      message: 'Logout successful',
      data,
    };

    return results;
  }
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken() {
    const data = this.authService.refreshToken();
    const results = {
      message: 'Refresh token successful',
      results: data,
    };

    return results;
  }
}
