import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {
    const connectionString = configService.getOrThrow('DATABASE_URL');
    const pool = new Pool({
      connectionString,
      // ssl: false,
    });
    const adapter = new PrismaPg(pool);
    super({
      adapter, // ← this is the key change for Prisma 7+
      // Optional: add logging, etc.
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  async onModuleInit() {
    // Note: this is optional
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
