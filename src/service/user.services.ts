import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { type SelectableUser, userSchema } from "../db/schema/user.schema.js";

export const getUserByEmail = async (email: string): Promise<SelectableUser[]> => {
    return await db.select().from(userSchema).where(eq(userSchema.email, email));
};
