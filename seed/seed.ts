import { seed } from 'drizzle-seed';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from 'src/drizzle/schema';
import * as dotenv from 'dotenv';
dotenv.config();

const main = async () => {
  const sql = neon(process.env.NEON_DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log('Begin seeding');
  await seed(db, schema).refine((funcs) => ({
    WorkersTable: {
      count: 100,
    },
    WorkplacesTable: {
      count: 25,
    },
  }));

  console.log('Finished seeding!');
};

main();
