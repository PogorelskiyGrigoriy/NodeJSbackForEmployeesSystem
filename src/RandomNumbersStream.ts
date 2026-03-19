import { Readable, type ReadableOptions } from "node:stream";

/**
 * High-performance readable stream for generating large sets of random integers.
 */
export default class RandomNumbersStream extends Readable {
    private counter: number = 0;

    constructor(
        private _amount: number,
        private _min: number,
        private _max: number,
        private _chunkNumbers: number = 1024 * 1024,
        options: ReadableOptions = { highWaterMark: 1024 * 1024 * 6 }
    ) {
        super(options);

        // Normalize range bounds
        if (this._min > this._max) {
            [this._min, this._max] = [this._max, this._min];
        }
    }

    /**
     * Standard Readable implementation: pushes data chunks until the total amount is reached.
     */
    override _read(): void {
        if (this.counter >= this._amount) {
            this.push(null); // End of stream
            return;
        }

        const remaining = this._amount - this.counter;
        const count = remaining < this._chunkNumbers ? remaining : this._chunkNumbers;
        
        const buffer = this._getFastChunkBuffer(count);
        
        this.counter += count;
        this.push(buffer);
    }

    /**
     * Generates a buffer using raw memory allocation and bitwise optimizations.
     */
    private _getFastChunkBuffer(count: number): Buffer {
        // Allocate raw memory without zero-filling for maximum speed
        const buf = Buffer.allocUnsafe(count * 4);
        
        // Create a TypedArray view over the shared buffer
        const array = new Uint32Array(buf.buffer, buf.byteOffset, count);
        
        // Cache properties locally to leverage CPU L1/L2 caches
        const min = this._min;
        const range = this._max - min + 1;

        for (let i = 0; i < count; i++) {
            // Use bitwise OR (| 0) for faster float-to-int conversion than Math.floor
            array[i] = ((Math.random() * range) | 0) + min;
        }

        return buf;
    }
}