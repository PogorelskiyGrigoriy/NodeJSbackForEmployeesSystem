// src/index.ts (или core/logger/init.ts)
import LoggerEmitter, { LogLevel } from "./logger-emitter.js";
import { ConsoleHandler } from "./console-log-handler.js";
import { FileHandler } from "./file-log-handler.js";
import { LevelFilterDecorator } from "./level-filter-decorator.js";
import { TimeFormatter } from "./time-formatter.js";

const formatter = new TimeFormatter();

// --- РЕАЛИЗАЦИЯ СПОСОБА 3 (Декораторы для файлов) ---
// 1. Общий файл (пишем всё от INFO и выше)
const allLogFile = new FileHandler("logs.txt", formatter);

// 2. Критический файл (пишем ТОЛЬКО ошибки)
const errorFile = new FileHandler("logs.txt", formatter);
const criticalOnlyDecorator = new LevelFilterDecorator(errorFile, ["ERROR", "FATAL"]);

// Создаем эмиттер с базовыми хендлерами
const logger = new LoggerEmitter([
    new ConsoleHandler(formatter), 
    allLogFile, 
    criticalOnlyDecorator // <-- Декоратор работает внутри списка хендлеров
], LogLevel.INFO);


// --- РЕАЛИЗАЦИЯ СПОСОБА 2 (События для алертов) ---
// Подписываем логику уведомлений на конкретный канал эмиттера
logger.on("message:FATAL", (message) => {
    // Здесь может быть вызов сервиса Телеграм или Почты
    console.warn("🚀 [ALERT SYSTEM] Sending emergency notification...");
    // emailService.sendAdminAlert(message);
});

// --- ПРОВЕРКА ---
logger.log("Standard operation", LogLevel.INFO);   // Пойдет в Console и app.log
logger.log("Critical DB failure!", LogLevel.FATAL); // Пойдет в Console, app.log, errors.log И сработает Алерт