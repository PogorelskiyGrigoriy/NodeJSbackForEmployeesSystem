import http from "node:http";
import calculate, { ServiceError } from "./service/calculate.js";
import type { CalcData } from "./model/CalcData.js";

const PORT = Number(process.env.PORT) || 3000;
const server = http.createServer();

// Универсальная функция ответа
function sendResponse(res: http.ServerResponse, status: number, message: string): void {
    res.statusCode = status;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end(message);
}

server.on("request", (req, res) => {
    // 1. Игнорируем фавикон
    if (req.url === '/favicon.ico') {
        res.statusCode = 404;
        return res.end();
    }

    // 2. Логируем входящий запрос (для отладки в консоли)
    console.log(`[${req.method}] ${req.url}`);

    const calcData = getCalcData(req.url ?? "");

    if (!calcData) {
        return sendResponse(res, 400, "Ошибка: Используйте формат /operation/num1/num2 (напр. /add/10/20)");
    }

    try {
        // Вызываем расчет
        const result = calculate(calcData);
        // Если всё ок — отправляем результат
        sendResponse(res, 200, result.toString());
    } catch (error: any) {
        // 3. Обработка кастомных ошибок сервиса
        if (error instanceof ServiceError) {
            sendResponse(res, error.status, error.message);
        } else {
            // Если упало что-то непредвиденное
            console.error("Unexpected error:", error);
            sendResponse(res, 500, "Внутренняя ошибка сервера");
        }
    }
});

function getCalcData(url: string): CalcData | null {
    const tokens = url.split("/").filter(Boolean);
    if (tokens.length < 3) return null;

    const [rawOperation = "", rawOp1 = "", rawOp2 = ""] = tokens;
    
    const operation = decodeURIComponent(rawOperation);
    const op1 = Number(rawOp1);
    const op2 = Number(rawOp2);

    if (isNaN(op1) || isNaN(op2)) return null;

    return { op1, op2, operation };
}

server.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 Калькулятор запущен!`);
    console.log(`Используй Postman или браузер:`);
    console.log(`http://localhost:${PORT}/add/10/5     -> 15`);
    console.log(`http://localhost:${PORT}/div/10/0     -> Error 400`);
    console.log(`http://localhost:${PORT}/percent/1/4  -> 25\n`);
});