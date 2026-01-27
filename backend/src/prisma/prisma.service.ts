import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client'; // Remove .js
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    // Pro-tip: Using a 'pg' Pool is often more stable for the adapter
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    const adapter = new PrismaPg(pool);
    
    super({ adapter });
  }
}