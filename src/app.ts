import path from "path";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { startCronJobs } from "./config/cronjob.js";

// import routes
import routers from "./routes/index.js";

// import middlewares
import ErrorMiddleware from "./middlewares/error.js";
import morganMiddleware from "./middlewares/morgan.js";

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
    app.use(morganMiddleware)
    app.use(express.urlencoded({ extended: true }))

    // cron jobs
    startCronJobs();

    // routes
    app.get('/', (req, res) => res.send('Welcome to Node JS!'))
    app.use('/api/v1', Object.values(routers));

    // error middleware
    app.use(ErrorMiddleware)

    return app;
}