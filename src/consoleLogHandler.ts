import type { LoggerHandler } from "./LoggerHandler.js";
import type { LoggerFormatter } from "./LoggerFormatter.js";

export class ConsoleHandler implements LoggerHandler {
    // 1. Принимаем форматер в конструкторе
    constructor(private _formatter: LoggerFormatter) {}

    handler(): (message: string) => void {
        // 2. Возвращаем функцию, которая использует форматер
        return (message: string) => {
            console.log(this._formatter.format(message));
        };
    }
}