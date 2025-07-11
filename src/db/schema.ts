import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

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

export const Role = pgEnum('role', ['user', 'admin']);

export const userTable = pgTable('users', {
  id: uuid('id').primaryKey().unique().defaultRandom(),
  userName: varchar('username', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: Role('role').default('user').notNull(),
  avatar: varchar('avatar', { length: 500 }).notNull(),
  isEmailVerified: boolean('email_varified').default(false),
  emailVarificationToken: varchar('email_varification_token', { length: 250 }),
  emailVarificationTokenExpire: timestamp('email_varification_token_expire', {
    withTimezone: true,
  }),
  passwordResetToken: varchar('password_reset_token', { length: 300 }),
  passwordResetTokenExpires: timestamp('password_reset_token_expire', {
    withTimezone: true,
  }),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});
export type SelectUser = InferSelectModel<typeof userTable>;
export type InsertUser = InferInsertModel<typeof userTable>;
export type SelectProduct = InferSelectModel<typeof productTable>;
export type InsertProduct = InferInsertModel<typeof productTable>;
