import { appendFileSync } from "node:fs"
import type { LoggerHandler } from "./LoggerHandler.js"
import type { LoggerFormatter } from "./LoggerFormatter.js"

export class FileHandler implements LoggerHandler {
    constructor(private _filePath: string, private _formatter: LoggerFormatter) {}

    // Update signature to accept (message, label)
    handler(): (message: string, label: string) => void {
        return (message: string, label: string) => 
            // Include label in the formatted string before writing to file
            appendFileSync(
                this._filePath, 
                this._formatter.format(message, label) + "\n", 
                { encoding: "utf-8" }
            );
    }
}