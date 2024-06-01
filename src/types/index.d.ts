import { Request } from "express";


// authenticated request type
export type AuthenticatedRequest = Request & {
    user?: any;
}