import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import ErrorHandler from "../util/errorHandler.js";
import { asyncHandler } from "../util/asyncHandler.js";
import { userSchema } from "../db/schema/userSchema.js";
import { refreshTokenSchema } from "../db/schema/refreshTokenSchema.js";
import { createAccessToken, createRefreshToken } from "../services/tokenService.js";
// issue new access token
export const issuseNewAccessToken = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return next(new ErrorHandler(403, "Refresh token not found in cookie."));
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        // handle error
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(new ErrorHandler(401, "Refresh token expired!"));
            }
            else if (err.name === 'JsonWebTokenError') {
                return next(new ErrorHandler(401, "Invalid access token!"));
            }
            else {
                return next(new ErrorHandler(401, "Unauthorized!"));
            }
        }
        // get user associated with refresh token
        const userId = decoded.id;
        const user = await db.query.userSchema.findFirst({ where: eq(userSchema.id, userId) });
        if (!user) {
            return next(new ErrorHandler(401, "User associated with the refresh token does not exist!"));
        }
        // delete the last refresh token from database
        await db.delete(refreshTokenSchema).where(eq(refreshTokenSchema.token, refreshToken));
        // crate new access token and refresh token
        const newwAccessToken = createAccessToken(user.id);
        const newRefreshToken = createRefreshToken(user.id);
        // insert new refresh token in database
        await db.insert(refreshTokenSchema).values({ token: newRefreshToken, userId: user.id });
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
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
    });
});
