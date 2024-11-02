import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { decimal, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";


// schema definition
export const productSchema = pgTable(
    "product",

    {
        id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
        name: varchar("name", { length: 50 }).notNull(),
        description: text("description").notNull(),
        price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
        stock: integer("stock").notNull(),
        image: text("image").notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull()
    }
);


// export the types
export type SelectableProduct = InferSelectModel<typeof productSchema>;
export type InsertableProduct = InferInsertModel<typeof productSchema>;
