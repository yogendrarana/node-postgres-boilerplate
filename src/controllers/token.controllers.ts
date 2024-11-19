import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { userSchema } from "../db/schema/user.js";
import { tokenSchema } from "../db/schema/token.js";
import ErrorHandler from "../handlers/errorHandler.js";
import { asyncHandler } from "../handlers/asyncHandler.js";
import { NextFunction, Request, Response } from "express";
import { createAccessToken, createRefreshToken } from "../helpers/token.helpers.js";

// issue new access token
export const issuseNewAccessToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return next(new ErrorHandler(403, "Refresh token not found in cookie."));
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!,
            async (err: any, decoded: any) => {
                // handle error
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        return next(new ErrorHandler(401, "Refresh token expired!"));
                    } else if (err.name === "JsonWebTokenError") {
                        return next(new ErrorHandler(401, "Invalid access token!"));
                    } else {
                        return next(new ErrorHandler(401, "Unauthorized!"));
                    }
                }

                // get user associated with refresh token
                const userId = (decoded as any).id;
                const user = await db.query.userSchema.findFirst({
                    where: eq(userSchema.id, userId)
                });
                if (!user) {
                    return next(
                        new ErrorHandler(
                            401,
                            "User associated with the refresh token does not exist!"
                        )
                    );
                }

                // delete the last refresh token from database
                await db.delete(tokenSchema).where(eq(tokenSchema.value, refreshToken));

                // crate new access token and refresh token
                const newwAccessToken = createAccessToken(user.id);
                const newRefreshToken = createRefreshToken(user.id);

                // insert new refresh token in database
                await db
                    .insert(tokenSchema)
                    .values({ type: "refresh_token", value: newRefreshToken, userId: user.id });

                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });

                res.status(200).json({
                    success: true,
                    message: "Access token generated successfully!",
                    data: {
                        accessToken: newwAccessToken,
                        user
                    }
                });
            }
        );
    }
);
