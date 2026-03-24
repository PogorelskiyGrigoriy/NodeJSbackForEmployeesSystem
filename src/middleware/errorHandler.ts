import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ServiceError } from "../errors/ServiceError.js";

export const errorHandler = (
    err: unknown, 
    req: Request, 
    res: Response, 
    next: NextFunction 
): void => {
    // Используем req.log, который добавил pino-http. 
    // Теперь лог ошибки будет содержать context запроса (traceId, метод, путь).
    const log = req.log || console; 

    // 1. Ошибки валидации Zod
    if (err instanceof z.ZodError) {
        const details = err.issues.map(e => ({
            path: e.path.join('.'),
            message: e.message
        }));
        
        // Логируем как предупреждение (warn), так как это ошибка клиента, а не сервера
        log.warn({ details }, "Validation failed");

        res.status(400).json({ 
            error: "Validation Error", 
            details 
        });
        return;
    }

    // 2. Ошибки бизнес-логики
    if (err instanceof ServiceError) {
        log.warn({ err }, err.message);
        res.status(err.code).json({ error: err.message });
        return;
    }

    // 3. Ошибки парсинга JSON
    if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
        log.warn("Invalid JSON received");
        res.status(400).json({ error: "Invalid JSON format" });
        return;
    }

    // 4. Критические ошибки (500)
    const message = err instanceof Error ? err.message : "Internal Server Error";
    
    // Здесь используем .error(), так как это реальный баг сервера
    log.error({ err }, "Unexpected server error"); 
    
    res.status(500).json({ error: message });
};