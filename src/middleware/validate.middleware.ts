import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodTypeAny) => 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Сами выбираем источник: GET -> query, остальное -> body
            const source = req.method === "GET" ? "query" : "body";
            const validatedData = await schema.parseAsync(req[source]);
            
            if (source === "body") {
                req.body = validatedData;
            } else {
                Object.assign(req.query, validatedData);
            }
            next();
        } catch (error) {
            next(error);
        }
    };