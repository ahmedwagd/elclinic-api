import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { Roles } from 'src/common/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post()
  @Roles(Role.ADMIN)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  async getAllUsers(@Query() query: { skip?: number; take?: number }) {
    const users = await this.userService.findAll(query);
    const results = {
      message: 'Users fetched successfully',
      users: users,
    };

    return results;
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async getUserById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, updateUserDto);
    return {
      message: 'User updated successfully',
      user: user,
    };
  }
  //   @Patch(':id/role')
  //   @Roles(Role.ADMIN)
  //   async updateUserRole(
  //     @Param('id') id: string,
  //     @Body() updateUserDto: UpdateUserDto,
  //   ) {
  //     return await this.userService.updateRole(id, updateUserDto);
  //   }
  @Delete(':id')
  @Roles(Role.ADMIN)
  async deleteUser(@Param('id') id: string) {
    const user = await this.userService.delete(id);
    return {
      message: 'User deleted successfully',
      user: user,
    };
  }
}
