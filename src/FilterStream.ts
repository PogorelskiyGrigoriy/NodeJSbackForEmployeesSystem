import { Transform, type TransformCallback } from "node:stream";

export default class FilterStream extends Transform {
    constructor(private _pred: (num: number) => boolean){
        super({objectMode: true})   
    }
    override _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
        // Specification: chunk is a number
        if (this._pred(chunk)) {
            this.push(chunk)
        }
        callback()
    }       
}