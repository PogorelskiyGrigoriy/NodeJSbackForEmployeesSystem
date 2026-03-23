import http from "node:http";
import { handleCalculate } from "./calculator.controller.js";
import { sendResponse } from "../utils/http-helpers.js";

const server = http.createServer();
const port = Number(process.env.PORT) || 3000;

server.on("request", async (req, res) => {
    // Simple Router
    if (req.method === "POST" && req.url === "/calculate") {
        return handleCalculate(req, res);
    }

    // Default 404
    sendResponse(res, 404, "Not Found. Use POST /calculate");
});

server.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server listening on port ${port}`);
});