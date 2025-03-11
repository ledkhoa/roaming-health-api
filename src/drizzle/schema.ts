import {
  uuid,
  pgTable,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

const createdAt = timestamp('created_at').notNull().defaultNow();
const updatedAt = timestamp('updated_at')
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

export const WorkersTable = pgTable('workers', {
  id: uuid().defaultRandom().primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  created_at: createdAt,
  updated_at: updatedAt,
  isActive: boolean('is_active').default(true).notNull(),
});
