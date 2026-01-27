import * as argon2 from 'argon2';
import { PrismaClient } from '../generated/prisma/client';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  // Generate hashed password for admin using argon2
  const hashedPassword = await argon2.hash('123456');
  // Seed ADMIN
  const ADMIN = await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('Admin seeded:', ADMIN);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
