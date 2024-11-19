import { eq } from "drizzle-orm"
import { db } from "../db/db.js"
import { SelectableUser, userSchema } from "../db/schema/user.js"

export const getUserByEmail = async (email: string): Promise<SelectableUser[]> => {
    return await db.select().from(userSchema).where(eq(userSchema.email, email))
}