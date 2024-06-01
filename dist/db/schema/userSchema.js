import { pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
// import schemas
import { refreshTokenSchema } from './refreshTokenSchema.js';
// role
export const roleEnum = pgEnum('role', ['user', 'admin']);
// schema definition
export const userSchema = pgTable('user', {
    id: uuid('id').primaryKey().unique().notNull().defaultRandom(),
    name: varchar('name', { length: 50 }),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password').notNull(),
    role: roleEnum('role').notNull().default('user'),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
// relations
export const userRelations = relations(userSchema, ({ many }) => ({
    refreshTokens: many(refreshTokenSchema)
}));
