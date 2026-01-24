import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
// import { withAccelerate } from '@prisma/extension-accelerate';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly prismaLogger = new Logger(PrismaService.name);
  constructor() {
    super({
      log: [
        { level: 'query', emit: 'event' }, // Log all queries
        { level: 'error', emit: 'event' }, // Log errors
        { level: 'info', emit: 'event' }, // Log informational messages
        { level: 'warn', emit: 'event' }, // Log warnings
      ],
    });
    this.$on('query' as never, (e: any) => {
      this.prismaLogger.debug(
        `Query: ${e.query} Params: ${e.params} Duration: ${e.duration}ms`,
      );
    });

    this.$on('error' as never, (e: any) => {
      this.prismaLogger.error(`Error: ${e.message}`);
    });

    this.$on('info' as never, (e: any) => {
      this.prismaLogger.log(`Info: ${e.message}`);
    });

    this.$on('warn' as never, (e: any) => {
      this.prismaLogger.warn(`Warning: ${e.message}`);
    });
  }
  async onModuleInit() {
    // Note: this is optional
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }

  extendedPrismaClient() {
    return this.$extends();
  }
}
