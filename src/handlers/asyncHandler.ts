import { NextFunction, Request, Response } from "express";

type ExpressRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>

export const asyncHandler = (passedFunction: ExpressRouteHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await passedFunction(req, res, next);
        } catch (err) {
            next(err);
        }
    }
}