import { Writable } from "node:stream";

export default class OutputStream extends Writable {
    constructor(private _delim: string = "; ") {
        super({objectMode: true})
    }
    // Specification: chunk is a number
    override _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
        process.stdout.write(chunk + this._delim)
        callback()
    }
    override _final(callback: (error?: Error | null) => void): void {
        process.stdout.write("\n")
        callback()
    }
}