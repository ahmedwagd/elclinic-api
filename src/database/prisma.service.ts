import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({
      connectionString,
      // ssl: false,
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }
  async onModuleInit() {
    // Note: this is optional
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
