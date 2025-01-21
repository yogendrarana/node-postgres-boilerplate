import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { type InsertableUser, type SelectableUser, userSchema } from "../db/schema/user.schema.js";

// get user by email
export const getUserByEmail = async (email: string): Promise<SelectableUser | undefined> => {
    const [user] = await db.select().from(userSchema).where(eq(userSchema.email, email));
    return user;
};

// insert user
export const insertUser = async (userData: InsertableUser) => {
    const [user] = await db
        .insert(userSchema)
        .values({ email: userData.email, password: userData.password })
        .returning({
            id: userSchema.id,
            name: userSchema.name,
            email: userSchema.email,
            role: userSchema.role
        });

    return user;
};
