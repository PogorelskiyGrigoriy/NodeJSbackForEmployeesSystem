import { Transform, type TransformCallback } from "node:stream";

export default class LimitStream extends Transform {
    private _current: number = 0;
    constructor(private _limit: number) {
        super({ objectMode: true })
    }
    override _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
        // Specification: chunk is a number
        if (this._current >= this._limit) {
            this.destroy()
        } else {
            this._current++;
            this.push(chunk);
        }
        callback()
    }
}