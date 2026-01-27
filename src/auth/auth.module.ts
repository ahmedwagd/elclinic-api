import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy, JwtStrategy, LocalStrategy } from './strategies';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PassportModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
