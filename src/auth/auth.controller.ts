import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  logIn(@Body() loginDto: LoginDto) {
    const data = this.authService.logIn(loginDto);

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
  refreshToken() {
    const data = this.authService.refreshToken();
    const results = {
      message: 'Refresh token successful',
      results: data,
    };

    return results;
  }
}
