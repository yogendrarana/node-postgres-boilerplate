import authRouter from "./auth.js";
import tokenRouter from "./token.js";
import adminRouter from "./admin.js";
import userRouter from "./user.js";

const routers = {
    authRouter,
    tokenRouter,
    adminRouter,
    userRouter
}

export default routers;