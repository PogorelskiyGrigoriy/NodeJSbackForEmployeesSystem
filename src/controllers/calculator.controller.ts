import type { Request, Response, NextFunction } from "express";
import calculate from "../services/calculate.js";
import {type CalcData } from "../models/CalcData.js";

/**
 * Обработчик логики калькулятора.
 * Теперь он максимально чистый и занимается только вызовом сервиса.
 */
export const handleCalculate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // Данные уже очищены и типизированы в req.body нашим middleware
        const calcData = req.body as CalcData;

        // Выполняем расчет
        const result = calculate(calcData);

        // Отправляем ответ в формате JSON (стандарт для API)
        res.json({ result });
    } catch (error) {
        // Передаем ошибку дальше в глобальный errorHandler
        next(error);
    }
};