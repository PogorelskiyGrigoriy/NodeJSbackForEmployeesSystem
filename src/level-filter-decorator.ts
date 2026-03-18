import type { LoggerHandler } from "./logger-handler.js";

export class LevelFilterDecorator implements LoggerHandler {
    constructor(
        private _innerHandler: LoggerHandler, 
        private _allowedLevels: string[] // например, ["ERROR", "FATAL"]
    ) {}

    handler() {
        const originalAction = this._innerHandler.handler();
        return (message: string, label: string) => {
            if (this._allowedLevels.includes(label.trim())) {
                originalAction(message, label);
            }
        };
    }
}