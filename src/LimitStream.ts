import { Transform, type TransformCallback } from "node:stream";

/**
 * A Transform stream that limits the number of chunks passed through.
 * Automatically destroys the stream once the limit is reached.
 */
export default class LimitStream extends Transform {
    private _current: number = 0;

    /**
     * @param _limit - The maximum number of items to allow through the stream.
     */
    constructor(private _limit: number) {
        // Enforce objectMode to handle numbers directly
        super({ objectMode: true });
    }

    /**
     * Core logic for limiting the data flow.
     * Increments the counter and pushes chunks until the limit is exceeded.
     */
    override _transform(
        chunk: any, 
        encoding: BufferEncoding, 
        callback: TransformCallback
    ): void {
        // Check if the limit has already been reached
        if (this._current >= this._limit) {
            // Stop the stream and clean up resources
            this.destroy();
        } else {
            // Forward the chunk and increment the counter
            this._current++;
            this.push(chunk);
        }

        // Notify the stream that processing is done for this chunk
        callback();
    }
}