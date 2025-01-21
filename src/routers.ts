import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import tokenRouter from "./routes/token.routes.js";

const routers = {
    authRouter,
    tokenRouter,
    adminRouter,
    userRouter
}

export default routers;