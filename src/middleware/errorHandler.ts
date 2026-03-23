import { ServerResponse } from "node:http";
import { z } from "zod";
import logger from "../pino-logger.js";
import { ServiceError } from "../errors/ServiceError.js";
import { sendResponse } from "../utils/http-helpers.js";

/**
 * Global error handler to catch and format all application errors.
 */
export function handleError(error: unknown, res: ServerResponse): void {
    if (error instanceof z.ZodError) {
        const msg = error.issues.map(e => e.message).join(", ");
        return sendResponse(res, 400, `Validation Error: ${msg}`);
    }

    if (error instanceof ServiceError) {
        return sendResponse(res, error.code, error.message);
    }

    if (error instanceof SyntaxError) {
        return sendResponse(res, 400, "Invalid JSON format");
    }

    const message = error instanceof Error ? error.message : "Internal Server Error";
    logger.error(error);
    sendResponse(res, 500, message);
}