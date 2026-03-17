import { appendFileSync } from "node:fs"
import type { LoggerHandler } from "./LoggerHandler.js"
import type { LoggerFormatter } from "./LoggerFormatter.js"

export class FileHandler implements LoggerHandler {
    constructor(private _filePath: string, private _formatter: LoggerFormatter) {
    }
    handler(): (message: string) => void {
        return (message: string) => appendFileSync(this._filePath,this._formatter.format(message)+"\n", {encoding: "utf-8"})
    }
}