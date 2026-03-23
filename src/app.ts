import express from "express";
import { CalcDataSchema } from "./models/CalcData.js";
import { validate } from "./middleware/validate.middleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { handleCalculate } from "./controllers/calculator.controller.js";

const app = express();

// Middleware для парсинга JSON
app.use(express.json());

// Роутинг: заменяет твой "Simple Router" на базе if/else
app.post("/calculate", validate(CalcDataSchema), handleCalculate);

// Обработка 404 (если запрос не попал ни в один роут выше)
app.use((req, res) => {
    res.status(404).json({ error: "Not Found. Use POST /calculate" });
});

// Глобальный обработчик ошибок (всегда в конце)
app.use(errorHandler);

export default app;