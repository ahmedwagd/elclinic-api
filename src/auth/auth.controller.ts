import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
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
  async logout() {
    const data = this.authService.logout();
    const results = {
      message: 'Logout successful',
      results: data,
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
