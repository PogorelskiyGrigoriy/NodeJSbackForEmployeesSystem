import { EventEmitter } from 'node:events';
import type { LoggerHandler } from './LoggerHandler.js';

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
        // Single validation point for minLevel
        this._minLevel = (minLevel !== undefined && minLevel in levelLabels) 
            ? minLevel 
            : LogLevel.INFO;

        handlers.forEach(h => this.on("message", h.handler()));
    }

    log(message: string, level: LogLevelValue = LogLevel.INFO): void {
        // Simple filtering: if level is invalid (e.g. 999), 
        if (level < this._minLevel || !(level in levelLabels)) {
            return;
        }

        this.emit("message", message, levelLabels[level]);
    }
}