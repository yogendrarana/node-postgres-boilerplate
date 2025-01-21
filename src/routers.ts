import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";

const routers = {
    authRouter,
    adminRouter,
    userRouter
}

export default routers;