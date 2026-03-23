import type { Request, Response, NextFunction } from "express";
import calculate from "../services/calculate.js";
import { type CalcData } from "../models/CalcData.js";

export const handleCalculate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // Безопасно объединяем данные. 
        // Если что-то пришло в body, оно перезапишет query (при совпадении ключей).
        // Если body — undefined, спреад-оператор просто его проигнорирует.
        const data = { ...req.query, ...req.body };

        // Если объект совсем пустой (например, просто GET /calculate без параметров),
        // сервис calculate упадет на деструктуризации.
        // Но наше middleware validate(CalcDataSchema) должно было поймать это раньше.
        
        const result = calculate(data as CalcData);
        res.json({ result });
    } catch (error) {
        next(error);
    }
};