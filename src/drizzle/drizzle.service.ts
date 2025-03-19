import { Injectable } from '@nestjs/common';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

@Injectable()
export class DrizzleService {
  client: NeonQueryFunction<false, false>;
  db: NeonHttpDatabase<typeof schema>;

  constructor() {
    this.client = neon(process.env.NEON_DATABASE_URL!);
    this.db = drizzle(this.client, { schema });
  }
}
