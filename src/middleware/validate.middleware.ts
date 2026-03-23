import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

/**
 * Универсальное middleware для валидации Zod-схем.
 * Используем z.ZodTypeAny для поддержки любых схем без предупреждений о депрекации.
 */
export const validate = (schema: z.ZodTypeAny) => 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // .parseAsync возвращает очищенные и трансформированные данные
            const validatedData = await schema.parseAsync(req.body);
            
            // Rule of Thumb: всегда перезаписывай req.body валидированными данными.
            // Это гарантирует наличие default-значений и правильных типов в контроллере.
            req.body = validatedData;
            
            next();
        } catch (error) {
            // Ошибка ZodError улетает в глобальный обработчик
            next(error);
        }
    };