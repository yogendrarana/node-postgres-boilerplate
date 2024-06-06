import morgan from "morgan";
import winstonLogger from "../logger/logger.js";

const stream = {
    write: (message: string) => winstonLogger.http(message),
};

const morganMiddleware = morgan(":method :url :status :res[content-length] - :response-time ms", { stream });

export default morganMiddleware;