import { PrismaService } from './database/prisma.service';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { PaginationInterceptor } from './common/interceptors/pagination.interceptor';
import formatUptime from './common/helpers/format-uptime.helper';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('/health')
  @Public()
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
      uptime: formatUptime(process.uptime()),
      usedMemory: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
        2,
      )} MB`,
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
