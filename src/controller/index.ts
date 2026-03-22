import logger from "../pino-logger.js";
import http, { ServerResponse, IncomingMessage } from "node:http";
import { z } from "zod";
import calculate from "../service/calculate.js";
import { CalcDataSchema } from "../model/CalcData.js";
import { ServiceError } from "../errors/ServiceError.js";

const server = http.createServer();
const port = Number(process.env.PORT) || 3000;

server.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server listening on port ${port}`);
});

server.on("request", async (req, res) => {
    // 1. Route and Method validation
    if (req.method !== "POST" || req.url !== "/calculate") {
        return sendResponse(res, 404, "Not Found. Use POST /calculate");
    }

    logger.debug(`Incoming request: ${req.method} ${req.url}`);

    try {
        // 2. Read raw request body with size limits
        const rawData = await getRawBody(req);
        
        // 3. Parse JSON and validate against Zod schema
        const json = JSON.parse(rawData);
        const calcData = CalcDataSchema.parse(json); 

        // 4. Execute business logic
        const result = calculate(calcData).toString();
        
        sendResponse(res, 200, result);

    } catch (error: unknown) {
    // 1. Check for Zod-specific validation errors
    if (error instanceof z.ZodError) {
        const msg = error.issues.map(e => e.message).join(", ");
        return sendResponse(res, 400, `Validation Error: ${msg}`);
    } 

    // 2. Check for our custom ServiceError
    if (error instanceof ServiceError) {
        return sendResponse(res, error.code, error.message);
    } 

    // 3. Check for standard JavaScript errors (like JSON.parse failure)
    if (error instanceof SyntaxError) {
        return sendResponse(res, 400, "Invalid JSON format");
    }

    // 4. Fallback for unexpected errors
    // Since it's unknown, we check if it's an Error object to safely access .message
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    
    logger.error(error);
    sendResponse(res, 500, errorMessage);
}
});

/**
 * Reads the request stream and returns the raw string body.
 * Throws a 413 error if the body exceeds the MAX_SIZE limit.
 */
async function getRawBody(request: IncomingMessage): Promise<string> {
    let data = "";
    const MAX_SIZE = 1024 * 1024; // 1 MB limit

    for await (const chunk of request) {
        data += chunk;
        if (data.length > MAX_SIZE) {
            throw new ServiceError(413, "Request body too large");
        }
    }

    if (!data) throw new ServiceError(400, "Empty request body");
    return data;
}

/**
 * Standardized helper to send HTTP responses.
 */
function sendResponse(response: ServerResponse, code: number, message: string): void {
    response.statusCode = code;
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.end(message);
}