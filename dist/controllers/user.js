import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../config/db/db.js';
import ErrorHandler from "../util/errorHandler.js";
import { asyncHandler } from "../util/asyncHandler.js";
import * as tokenService from '../services/token.js';
import { userSchema } from '../config/db/schema/user.js';
import { tokenSchema } from '../config/db/schema/token.js';
import { loginUserSchema, registerUserSchema } from '../schemas/user.js';
// registerUser
export const registerUser = asyncHandler(async (req, res, next) => {
    const { email, password, confirm_password } = req.body;
    const validate = await registerUserSchema.safeParse({ email, password, confirm_password });
    if (!validate.success) {
        return next(new ErrorHandler(400, validate.error.errors[0].message));
    }
    // check if user exists in database
    const userExists = await db.select().from(userSchema).where(eq(userSchema.email, email));
    if (userExists.length !== 0) {
        return next(new ErrorHandler(400, "The email is already registered."));
    }
    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db.insert(userSchema)
        .values({ email, password: hashedPassword })
        .returning({ id: userSchema.id, name: userSchema.name, email: userSchema.email, role: userSchema.role });
    // generate tokens
    const accessToken = tokenService.createAccessToken(user.id);
    const refreshToken = tokenService.createRefreshToken(user.id);
    // save refresh token in database
    await db.insert(tokenSchema).values([{ type: 'refresh_token', value: refreshToken, userId: user.id }]);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // client cannot access cookie
        secure: true, // set to true if your using https
        sameSite: 'none', // 'none' | 'lax' | 'strict'
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.status(200).json({
        success: true,
        data: {
            message: "Registered successfully.",
            accessToken,
            user
        }
    });
});
// loginUser
export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const validate = await loginUserSchema.safeParse({ email, password });
    if (!validate.success) {
        return next(new ErrorHandler(400, validate.error.errors[0].message));
    }
    // check if user exists in database
    const [user] = await db.select().from(userSchema).where(eq(userSchema.email, email));
    if (!user) {
        return next(new ErrorHandler(404, "Invalid email or password."));
    }
    // check of password matches
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
        return next(new ErrorHandler(404, "Invalid email or password."));
    }
    // generate token
    const accessToken = tokenService.createAccessToken(user.id);
    const refreshToken = tokenService.createRefreshToken(user.id);
    // save refresh token in database
    await db.insert(tokenSchema).values({ type: "refresh_token", value: refreshToken, userId: user.id });
    // set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // client cannot access cookie
        secure: true, // set to true if your using https
        sameSite: 'none', // 'none' | 'lax' | 'strict'
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
export const logoutUser = asyncHandler(async (req, res, next) => {
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
    res.clearCookie('refreshToken');
    res.status(200).json({
        success: true,
        data: {
            message: "Logged out successfully.",
        }
    });
});
