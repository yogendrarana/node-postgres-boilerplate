import path from "path";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

// import routes
import userRoutes from "./routes/user.js";
import tokenRoutes from "./routes/token.js";
import adminRoutes from "./routes/admin.js";

// import middlewares
import ErrorMiddleware from "./middlewares/errorMiddleware.js";

export default function createApp() {
    // express app
    const app = express();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // set view engine
    app.set('view engine', 'ejs');
    app.set('views', 'views');
    app.use(express.static(path.join(__dirname, './public')));

    // dot env
    dotenv.config({ path: '.env' })

    // middleware
    app.use(express.json())
    app.use(cookieParser())
    app.use(express.urlencoded({ extended: true }))

    // routes
    app.get('/', (req, res) => res.send('Welcome to Node JS!'))
    app.use('/api/v1', userRoutes);
    app.use('/api/v1', tokenRoutes);
    app.use('/api/v1', adminRoutes);

    // error middleware
    app.use(ErrorMiddleware)

    return app;
}