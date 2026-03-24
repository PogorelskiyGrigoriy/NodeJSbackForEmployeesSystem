import { pinoHttp } from "pino-http";
import crypto from "node:crypto";
import logger from "../pino-logger.js";

export const httpLogger = pinoHttp({
    logger,
    genReqId: (req) => req.headers["x-request-id"] || crypto.randomUUID(),
    customSuccessMessage: (req, res) => `${req.method} ${req.url} completed with status ${res.statusCode}`,
    customErrorMessage: (req, res, err) => `${req.method} ${req.url} failed: ${err.message}`,
    serializers: {
        req: (req) => ({ id: req.id, method: req.method, url: req.url }),
        res: (res) => ({ statusCode: res.statusCode })
    }
});