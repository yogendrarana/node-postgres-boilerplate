import dotenv from "dotenv";
import http from "node:http";
import path from "node:path";
import { startCronJobs } from "./config/cronjob.js";
import { configureSentry } from "./config/sentry.js";

// .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// config
startCronJobs();
configureSentry();

// Import createExpressApp after Sentry is configured
const { default: createExpressApp } = await import("./app.js");

// create express app
const app = createExpressApp();

// create server
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})