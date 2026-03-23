import { IncomingMessage, ServerResponse } from "node:http";
import { ServiceError } from "../errors/ServiceError.js";

/**
 * Reads raw string body from the request stream with size limits.
 */
export async function getRawBody(request: IncomingMessage): Promise<string> {
    let data = "";
    const MAX_SIZE = 1024 * 1024;

    for await (const chunk of request) {
        data += chunk;
        if (data.length > MAX_SIZE) throw new ServiceError(413, "Payload too large");
    }

    if (!data) throw new ServiceError(400, "Empty request body");
    return data;
}

/**
 * Standardized response helper.
 */
export function sendResponse(res: ServerResponse, code: number, message: string): void {
    res.statusCode = code;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(message);
}