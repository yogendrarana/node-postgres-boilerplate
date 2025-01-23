declare module "express" {
    export interface Request {
        failedLoginAttempts?: number;
    }
}

export {};
