import { seed } from 'drizzle-seed';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from 'src/drizzle/schema';

import * as dotenv from 'dotenv';
dotenv.config();

const main = async () => {
  const sql = neon(process.env.NEON_DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log('Deleting Workers');
  await db.delete(schema.WorkersTable);
  console.log('Finished deleting Workers');

  console.log('Finished deleting!');
};

main();
