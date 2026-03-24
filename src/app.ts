import express from "express";
import { CalcDataSchema } from "./models/CalcData.js";
import { validate } from "./middleware/validate.middleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { handleCalculate } from "./controllers/calculator.controller.js";
import { httpLogger } from "./middleware/httpLogger.js";

const app = express();

app.use(httpLogger);

// Middleware для парсинга JSON
app.use(express.json());

app.route("/calculate")
   .get(validate(CalcDataSchema), handleCalculate)
   .post(validate(CalcDataSchema), handleCalculate);

// Обработка 404 (если запрос не попал ни в один роут выше)
app.use((req, res) => {
    res.status(404).json({ 
        error: "Route not found", 
        message: "Valid endpoints: GET/POST /calculate" 
    });
});

// Глобальный обработчик ошибок (всегда в конце)
app.use(errorHandler);

export default app;