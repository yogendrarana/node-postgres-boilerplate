import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { userSchema } from "../db/schema/user.schema.js";
import { tokenSchema } from "../db/schema/token.schema.js";
import ErrorHandler from "../handlers/errorHandler.js";
import { TOKEN_TYPE } from "../constants/enum/index.js";
import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../handlers/asyncHandler.js";
import * as tokenServices from "../service/token.services.js";
import { loginUserSchema, registerUserSchema } from "../schemas/user.js";

// registerUser
export const registerUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password, confirm_password } = req.body;

        const validate = await registerUserSchema.safeParse({ email, password, confirm_password });
        if (!validate.success) {
            const errorMessage = validate.error.errors[0]?.message || "Validation error";
            return next(new ErrorHandler(400, errorMessage));
        }

        // check if user exists in database
        const existingUser = await db.select().from(userSchema).where(eq(userSchema.email, email));
        if (existingUser.length !== 0) {
            return next(new ErrorHandler(400, "The email is already registered. Please login."));
        }

        // encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);
        const [user] = await db
            .insert(userSchema)
            .values({ email, password: hashedPassword })
            .returning({
                id: userSchema.id,
                name: userSchema.name,
                email: userSchema.email,
                role: userSchema.role
            });

        if (!user) {
            return next(new ErrorHandler(500, "User registration failed."));
        }

        // generate tokens
        const accessToken = tokenServices.createAccessToken(user.id);
        const refreshToken = tokenServices.createRefreshToken(user.id);

        // save refresh token in database
        await db
            .insert(tokenSchema)
            .values([{ type: TOKEN_TYPE.REFRESH_TOKEN, value: refreshToken, userId: user.id }]);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            success: true,
            data: {
                message: "Registered successfully.",
                accessToken,
                user
            }
        });
    }
);

// loginUser
export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const validate = await loginUserSchema.safeParse({ email, password });
    if (!validate.success) {
        const errorMessage = validate.error.errors[0]?.message || "Validation error";
        return next(new ErrorHandler(400, errorMessage));
    }

    // check if user exists in database
    const [user] = await db.select().from(userSchema).where(eq(userSchema.email, email));
    if (!user) {
        return next(new ErrorHandler(400, "Invalid email or password."));
    }

    // check of password matches
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
        return next(new ErrorHandler(400, "Invalid email or password."));
    }

    // generate token
    const accessToken = tokenServices.createAccessToken(user.id);
    const refreshToken = tokenServices.createRefreshToken(user.id);

    // save refresh token in database
    await db
        .insert(tokenSchema)
        .values({ type: "refresh_token", value: refreshToken, userId: user.id });

    // set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // client cannot access cookie
        secure: true, // set to true if your using https
        sameSite: "none", // 'none' | 'lax' | 'strict'
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
        success: true,
        data: {
            message: "Logged in successfully.",
            accessToken,
            user
        }
    });
});

// logoutUser
export const logoutUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return next(new ErrorHandler(400, "Please login first to logout."));
    }

    // get refresh token from database
    const foundRefreshToken = await db.query.tokenSchema.findFirst({
        where: eq(tokenSchema.value, refreshToken),
        with: {
            user: true
        }
    });

    if (!foundRefreshToken) {
        return next(new ErrorHandler(400, "Please login first to logout."));
    }

    // checkk if refresh token has associated user or not
    if (!foundRefreshToken.user) {
        return next(new ErrorHandler(400, "Please login first to logout."));
    }

    // delete refresh token from database
    await db.delete(tokenSchema).where(eq(tokenSchema.value, refreshToken));

    // clear cookie
    res.clearCookie("refreshToken");
    res.status(200).json({
        success: true,
        data: {
            message: "Logged out successfully."
        }
    });
});
