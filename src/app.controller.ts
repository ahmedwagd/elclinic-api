import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
  @Get('test')
  async getTest() {
    const users = await this.prismaService.user.findMany();

    console.log('Test World!', users);
    return users;
  }
}
