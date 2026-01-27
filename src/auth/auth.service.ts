import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  async logIn(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const hashedPassword = await argon2.hash(password);
    // TODO: Add logic to validate email and password
    // TODO: Add logic to return access token and refresh token
    const loginData = { email, password: hashedPassword };
    // TODO: Fix this message "Cannot read properties of undefined (reading 'hash')"

    console.log(loginData);
    const data = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
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
}
