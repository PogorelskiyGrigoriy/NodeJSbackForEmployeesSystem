import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import logger from "../pino-logger.js";
import { ServiceError } from "../errors/ServiceError.js";

/**
 * Global Error Middleware.
 * ВАЖНО: Express понимает, что это обработчик ошибок, только если аргументов РОВНО 4.
 */
export const errorHandler = (
    err: unknown, 
    req: Request, 
    res: Response, 
    next: NextFunction // Даже если не используем, он должен быть в сигнатуре!
): void => {
    // 1. Ошибки валидации Zod
    if (err instanceof z.ZodError) {
        // Профессиональный подход: возвращаем массив конкретных ошибок по полям
        const details = err.issues.map(e => ({
            path: e.path.join('.'),
            message: e.message
        }));
        
        res.status(400).json({ 
            error: "Validation Error", 
            details 
        });
        return;
    }

    // 2. Твои кастомные ошибки бизнес-логики
    if (err instanceof ServiceError) {
        res.status(err.code).json({ error: err.message });
        return;
    }

    // 3. Ошибки парсинга JSON (например, битый JSON от express.json())
    if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
        res.status(400).json({ error: "Invalid JSON format" });
        return;
    }

    // 4. Все остальные непредвиденные ошибки (500)
    const message = err instanceof Error ? err.message : "Internal Server Error";
    
    logger.error(err); // Логируем полную ошибку для разработчика
    
    res.status(500).json({ error: message });
};