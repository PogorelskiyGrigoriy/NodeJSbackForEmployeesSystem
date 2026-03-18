import { EventEmitter } from 'node:events';
import type { LoggerHandler } from './logger-handler.js';

export const LogLevel = {
    TRACE: 0, DEBUG: 1, INFO: 2, WARN: 3, ERROR: 4, FATAL: 5
} as const;

export type LogLevelValue = typeof LogLevel[keyof typeof LogLevel];

export const levelLabels: Record<LogLevelValue, string> = {
    0: "TRACE", 1: "DEBUG", 2: "INFO ", 3: "WARN ", 4: "ERROR", 5: "FATAL"
};

export default class LoggerEmitter extends EventEmitter {
    private _minLevel: LogLevelValue;

    constructor(handlers: LoggerHandler[] = [], minLevel?: LogLevelValue) {
        super();
        this._minLevel = (minLevel !== undefined && minLevel in levelLabels) 
            ? minLevel 
            : LogLevel.INFO;

        handlers.forEach(h => this.setHandler(h));
    }

    setHandler(handler: LoggerHandler): void {
        this.on("message", handler.handler());
    }

    /**
     * Метод для подписки хендлера на конкретный уровень (например, "FATAL")
     */
    setSpecializedHandler(levelName: keyof typeof LogLevel, handler: LoggerHandler): void {
        this.on(`message:${levelName}`, handler.handler());
    }

    log(message: string, level: LogLevelValue = LogLevel.INFO): void {
        if (level < this._minLevel || !(level in levelLabels)) return;

        const label = levelLabels[level];
        const cleanLabel = label.trim();

        // ОБЩЕЕ СОБЫТИЕ: для всех обычных хендлеров (Консоль, Общий файл)
        this.emit("message", message, label);

        // СПЕЦИФИЧЕСКОЕ СОБЫТИЕ (Способ 2): для мгновенных алертов
        this.emit(`message:${cleanLabel}`, message, label);
    }
}