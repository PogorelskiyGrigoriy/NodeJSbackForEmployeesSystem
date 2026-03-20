import { Transform, type TransformCallback } from "node:stream";

/**
 * A Transform stream that filters out duplicate values.
 * Operates in objectMode and ensures each unique chunk passes through only once.
 */
export default class UniqueStream extends Transform {
    /** * Using a Set for O(1) lookup performance to track seen values 
     */
    private _seen: Set<number> = new Set();

    constructor() {
        // Enforce objectMode to handle numbers directly
        super({ objectMode: true });
    }

    /**
     * Core logic for uniqueness filtering.
     * Only pushes the chunk if it hasn't been encountered yet.
     */
    override _transform(
        chunk: any, 
        encoding: BufferEncoding, 
        callback: TransformCallback
    ): void {
        // Check if the value is already in the Set
        if (!this._seen.has(chunk)) {
            // Store the new value and forward it down the pipeline
            this._seen.add(chunk);
            this.push(chunk);
        }
        
        // Notify the stream that the current chunk has been processed
        callback();
    }

    /**
     * Clean up resources after the stream has finished processing.
     * Clears the Set to release memory.
     */
    override _flush(callback: TransformCallback): void {
        this._seen.clear();
        callback();
    }
}