import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import adminRouter from "./admin.routes.js";
import tokenRouter from "./token.routes.js";

const routers = {
    authRouter,
    tokenRouter,
    adminRouter,
    userRouter
}

export default routers;