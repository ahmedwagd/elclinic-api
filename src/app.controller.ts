import { PrismaService } from './database/prisma.service';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { PaginationInterceptor } from './common/interceptors/pagination.interceptor';

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('/health')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(PaginationInterceptor)
  async getHealth() {
    const [usersCount, doctorsCount, patientsCount, appointmentsCount] =
      await this.prismaService.$transaction([
        this.prismaService.user.count(),
        this.prismaService.doctor.count(),
        this.prismaService.patient.count(),
        this.prismaService.appointment.count(),
      ]);
    const health = {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date(Date.now()).toLocaleString(),
      totalCounts: {
        usersCount,
        doctorsCount,
        patientsCount,
        appointmentsCount,
      },
    };
    return {
      message: 'Health check passed',
      results: health,
    };
  }
}
