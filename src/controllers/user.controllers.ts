import type { Request, Response } from "express";
import { asyncHandler } from "../handlers/asyncHandler.js";

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "Get all users" });
});