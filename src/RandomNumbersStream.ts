import { Readable, type ReadableOptions } from "node:stream";

/**
 * Object-mode stream generating individual JavaScript numbers.
 * Compatible with your FilterStream and LimitStream (objectMode: true).
 */
export default class InfiniteRandomObjectStream extends Readable {
    constructor(
        private _min: number,
        private _max: number,
        options: ReadableOptions = {}
    ) {
        // Force objectMode: true so we can push numbers instead of Buffers
        super({ ...options, objectMode: true });

        if (this._min > this._max) {
            [this._min, this._max] = [this._max, this._min];
        }
    }

    /**
     * Standard _read for objectMode. 
     * We push numbers in a loop until this.push() returns false (backpressure).
     */
    override _read(): void {
        const range = this._max - this._min + 1;
        let keepPushing = true;

        while (keepPushing) {
            const randomNumber = ((Math.random() * range) | 0) + this._min;
            
            // push(number) works here because of objectMode: true
            keepPushing = this.push(randomNumber);
        }
    }
}