import { Injectable } from '@nestjs/common';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

@Injectable()
export class DrizzleService {
  client: NeonQueryFunction<false, false> | postgres.Sql;
  db: NeonHttpDatabase<typeof schema> | ReturnType<typeof drizzlePg>;

  constructor() {
    const databaseUrl = process.env.NEON_DATABASE_URL!;
    
    // Check if we're using Neon (serverless) or regular PostgreSQL
    if (databaseUrl.includes('neon.tech') || process.env.NODE_ENV === 'production') {
      // Use Neon for production/serverless environments
      this.client = neon(databaseUrl);
      this.db = drizzle(this.client, { schema });
    } else {
      // Use regular PostgreSQL for local development and testing
      this.client = postgres(databaseUrl);
      this.db = drizzlePg(this.client, { schema });
    }
  }
}
