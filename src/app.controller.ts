import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/health')
  @HttpCode(HttpStatus.OK)
  async getHealth() {
    const health = {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date(Date.now()).toLocaleString(),
    };
    return {
      message: 'Health check passed',
      results: health,
    };
  }
}
