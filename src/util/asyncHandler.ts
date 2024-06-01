import { NextFunction, Request, Response } from "express";

type ExpressRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>

export const asyncHandler = (passedFunction: ExpressRouteHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(passedFunction(req, res, next)).catch(next);
    }
}