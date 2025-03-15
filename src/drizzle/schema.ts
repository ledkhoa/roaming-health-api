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

export const WorkplacesTable = pgTable('workplaces', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  address1: varchar({ length: 255 }).notNull(),
  address2: varchar({ length: 128 }),
  city: varchar({ length: 128 }).notNull(),
  state: varchar({ length: 13 }).notNull(),
  zip: varchar({ length: 5 }).notNull(),
  isActive: boolean('is_active').default(false).notNull(),
});
