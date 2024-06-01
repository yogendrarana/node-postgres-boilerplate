import { eq } from "drizzle-orm";
import { db } from "../config/db/db.js";
import { userSchema } from "../config/db/schema/user.js";
export const getUserByEmail = async (email) => {
    return await db.select().from(userSchema).where(eq(userSchema.email, email));
};
