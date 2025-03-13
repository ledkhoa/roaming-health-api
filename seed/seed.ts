import { seed } from 'drizzle-seed';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from 'src/drizzle/schema';
import * as dotenv from 'dotenv';
dotenv.config();

const main = async () => {
  const sql = neon(process.env.NEON_DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log('Seeding Workers');
  await seed(db, schema.WorkersTable, { count: 25 });
  console.log('Finished seeding Workers');

  console.log('Finished seeding!');
};

main();
