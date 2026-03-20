import { Readable, type ReadableOptions } from "node:stream";

/**
 * A Readable stream that generates random integers within a specified range.
 * Operates in objectMode to output numbers directly.
 */
export default class InfiniteRandomObjectStream extends Readable {
    /**
     * @param _min - Minimum possible value (inclusive)
     * @param _max - Maximum possible value (inclusive)
     * @param options - Standard Node.js Readable stream options
     */
    constructor(
        private _min: number,
        private _max: number,
        options: ReadableOptions = {}
    ) {
        // Ensure objectMode is active to handle numbers instead of Buffers
        super({ ...options, objectMode: true });

        // Swap values if min is greater than max to ensure valid range
        if (this._min > this._max) {
            [this._min, this._max] = [this._max, this._min];
        }
    }

    /**
     * Core logic for data generation.
     * Continues pushing random numbers until the internal buffer is full (backpressure).
     */
    override _read(): void {
        const range = this._max - this._min + 1;
        let keepPushing = true;

        while (keepPushing) {
            // Faster integer truncation using bitwise OR
            const randomNumber = ((Math.random() * range) | 0) + this._min;
            
            // push() returns false when the highWaterMark is reached
            keepPushing = this.push(randomNumber);
        }
    }
}