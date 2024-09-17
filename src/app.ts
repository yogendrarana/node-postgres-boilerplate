// All other imports below
import path from "path";
import express from "express";
import * as Sentry from "@sentry/node";
import cookieParser from "cookie-parser";
import { __dirname } from "./util/path.js";

// routes
import routers from "./routes/index.js";

// middlewares
import ErrorMiddleware from "./middlewares/error.js";
import MorganMiddleware from "./middlewares/morgan.js";

export default function createExpressApp() {
    const app = express();

    // set view engine
    app.set('view engine', 'ejs');
    app.set('views', 'views');
    app.use(express.static(path.join(__dirname, './public')));

    // middleware
    app.use(express.json())
    app.use(cookieParser())
    app.use(MorganMiddleware)
    app.use(express.urlencoded({ extended: true }))
    
    // routes
    app.get('/', (req, res) => res.send('Welcome to Node JS!'))
    app.use('/api/v1', Object.values(routers));

    Sentry.setupExpressErrorHandler(app);

    // error middleware
    app.use(ErrorMiddleware)

    return app;
}