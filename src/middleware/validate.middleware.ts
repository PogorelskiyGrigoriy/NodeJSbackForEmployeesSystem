import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodTypeAny, source: "body" | "query" = "body") => 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Валидируем данные
            const validatedData = await schema.parseAsync(req[source]);
            
            // Если мы валидируем body — перезаписываем целиком (тут это работает)
            if (source === "body") {
                req.body = validatedData;
            } 
            // Если query — копируем свойства в объект, не заменяя сам объект
            else {
                // Очищаем старые строковые данные и заменяем на валидированные (числа)
                Object.assign(req.query, validatedData);
            }
            
            next();
        } catch (error) {
            next(error);
        }
    };