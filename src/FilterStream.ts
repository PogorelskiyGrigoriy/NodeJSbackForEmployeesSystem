import { Transform, type TransformCallback } from "node:stream";

/**
 * A Transform stream that filters incoming data based on a predicate function.
 * Operates in objectMode to process individual values.
 */
export default class FilterStream extends Transform {
    /**
     * @param _pred - A function that returns true if the value should pass through.
     */
    constructor(private _pred: (num: number) => boolean) {
        // Enforce objectMode to handle numbers and avoid Buffer conversion
        super({ objectMode: true });
    }

    /**
     * Core logic for filtering chunks.
     * Only pushes the chunk further if the predicate returns true.
     */
    override _transform(
        chunk: any, 
        encoding: BufferEncoding, 
        callback: TransformCallback
    ): void {
        // Apply the filtering logic
        if (this._pred(chunk)) {
            this.push(chunk);
        }

        // Notify the stream that the current chunk has been processed
        callback();
    }
}