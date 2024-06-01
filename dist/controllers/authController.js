import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../db/db.js';
import * as authSchema from '../zod/authSchema.js';
import ErrorHandler from "../util/errorHandler.js";
import { asyncHandler } from "../util/asyncHandler.js";
import * as tokenService from '../services/tokenService.js';
import { userSchema } from '../db/schema/userSchema.js';
import { refreshTokenSchema } from '../db/schema/refreshTokenSchema.js';
// registerUser
export const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, confirm_password } = req.body;
    // check if email and password are provided
    if (!email || !password) {
        return next(new ErrorHandler(400, "Please provide an email and password."));
    }
    // check if password and confirm password match
    if (password !== confirm_password) {
        return next(new ErrorHandler(400, "Passwords do not match."));
    }
    // check if email is valid
    const isValidEmail = (await authSchema.emailSchema.safeParseAsync(email));
    if (!isValidEmail.success) {
        return next(new ErrorHandler(400, isValidEmail.error.errors[0].message));
    }
    // check if password is valid
    const isValidPassword = (await authSchema.passwordSchema.safeParseAsync(password));
    if (!isValidPassword.success) {
        return next(new ErrorHandler(400, isValidPassword.error.errors[0].message));
    }
    // check if user exists in database
    const userExists = await db.select().from(userSchema).where(eq(userSchema.email, email));
    if (userExists.length !== 0) {
        return next(new ErrorHandler(400, "The email is already registered."));
    }
    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);
    // save user in database
    const [user] = await db.insert(userSchema).values({ name, email, password: hashedPassword }).returning();
    // generate tokens
    const accessToken = tokenService.createAccessToken(user.id);
    const refreshToken = tokenService.createRefreshToken(user.id);
    // save refresh token in database
    await db.insert(refreshTokenSchema).values({ token: refreshToken, userId: user.id });
    // set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // client cannot access cookie
        secure: true, // set to true if your using https
        sameSite: 'none', // 'none' | 'lax' | 'strict'
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.status(200).json({
        success: true,
        message: "Registered successfully.",
        data: {
            accessToken,
            user
        }
    });
});
// loginUser
export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    // check if email and password are provided
    if (!email || !password) {
        return next(new ErrorHandler(400, "Please provide an email and password."));
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
    await db.insert(refreshTokenSchema).values({ token: refreshToken, userId: user.id });
    // set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // client cannot access cookie
        secure: true, // set to true if your using https
        sameSite: 'none', // 'none' | 'lax' | 'strict'
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.status(200).json({
        success: true,
        message: "Logged in successfully.",
        data: {
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
    const foundRefreshToken = await db.query.refreshTokenSchema.findFirst({
        where: eq(refreshTokenSchema.token, refreshToken),
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
    await db.delete(refreshTokenSchema).where(eq(refreshTokenSchema.token, refreshToken));
    // clear cookie
    res.clearCookie('refreshToken');
    res.status(200).json({
        success: true,
        message: "Logged out successfully.",
    });
});
