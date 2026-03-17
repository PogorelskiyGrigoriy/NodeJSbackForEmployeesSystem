import { appendFileSync } from "node:fs"
import type { LoggerHandler } from "./LoggerHandler.js"

export class FileHandler implements LoggerHandler {
    constructor(private _filePath: string) {
    }
    handler(): (message: string) => void {
        return (message: string) => appendFileSync(this._filePath,message+"\n", {encoding: "utf-8"})
    }
}