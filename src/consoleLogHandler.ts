import type { LoggerHandler } from "./LoggerHandler.js";
import type { LoggerFormatter } from "./LoggerFormatter.js";

export class ConsoleHandler implements LoggerHandler {
    constructor(private _formatter: LoggerFormatter) {}

    // Update signature to accept (message, label)
    handler(): (message: string, label: string) => void {
        return (message: string, label: string) => {
            // Pass label to formatter for improved output
            console.log(this._formatter.format(message, label));
        };
    }
}