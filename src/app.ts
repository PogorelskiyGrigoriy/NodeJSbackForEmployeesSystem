import express from "express";
import { CalcDataSchema } from "./models/CalcData.js";
import { validate } from "./middleware/validate.middleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { handleCalculate } from "./controllers/calculator.controller.js";
import { pinoHttp } from "pino-http";
import logger from "./pino-logger.js";
import crypto from "node:crypto";

const app = express();

app.use(pinoHttp({ 
    logger,
    // 1. Присваиваем каждому запросу уникальный ID
    genReqId: (req) => req.headers["x-request-id"] || crypto.randomUUID(),

    // 2. Кастомизируем сообщение лога (чтобы в консоли было понятно сразу)
    customSuccessMessage: (req, res) => {
        return `${req.method} ${req.url} completed with status ${res.statusCode}`;
    },

    // 3. Кастомизируем сообщение об ошибке
    customErrorMessage: (req, res, err) => {
        return `${req.method} ${req.url} failed: ${err.message}`;
    },

    // 4. Сериализация (убираем лишний мусор из логов, оставляем суть)
    serializers: {
        req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            // query: req.query, // можно добавить, если хочешь видеть параметры в логе
        }),
        res: (res) => ({
            statusCode: res.statusCode
        })
    }
}));

// Middleware для парсинга JSON
app.use(express.json());

app.route("/calculate")
   .get(validate(CalcDataSchema), handleCalculate)
   .post(validate(CalcDataSchema), handleCalculate);

// Обработка 404 (если запрос не попал ни в один роут выше)
app.use((req, res) => {
    res.status(404).json({ error: "Not Found. Use POST /calculate" });
});

// Глобальный обработчик ошибок (всегда в конце)
app.use(errorHandler);

export default app;