import { IncomingMessage, ServerResponse } from "node:http";
import { getRawBody, sendResponse } from "../utils/http-helpers.js";
import { CalcDataSchema } from "../model/CalcData.js";
import calculate from "../service/calculate.js";
import { handleError } from "../middleware/errorHandler.js";

/**
 * Handles the calculation logic.
 */
export async function handleCalculate(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
        const rawData = await getRawBody(req);
        const json = JSON.parse(rawData);
        const calcData = CalcDataSchema.parse(json);

        const result = calculate(calcData).toString();
        sendResponse(res, 200, result);
    } catch (error) {
        handleError(error, res);
    }
}