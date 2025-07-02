import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// export const usersTable = pgTable("users", {
//   id: integer().primaryKey().generatedAlwaysAsIdentity(),
//   name: varchar({ length: 255 }).notNull(),
//   description: integer().notNull(),
//   email: varchar({ length: 255 }).notNull().unique(),
// });
// const category=pgEnum('category',['Audio','Watch',"Headphone"])

export const productTable = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar({ length: 255 }),
  description: varchar({ length: 255 }),
  price: integer().notNull(),
  inStock: boolean(),
  category: varchar({ length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  deleteAt: timestamp('delet_at', { withTimezone: true }),
});
