import { Readable, type ReadableOptions } from "node:stream";

export default class RandomNumbersStream extends Readable {
    private counter: number = 0;
    constructor(
        private _amount: number,
        private _min: number,
        private _max: number,
        private _chunkNumbers: number = 1024 * 256,
        options: ReadableOptions = { highWaterMark: 1024 * 1024 }) {
        super(options)
        if (_min > _max) {
            [_min, _max] = [_max, _min]
        }
    }
    override _read(_: number): void {
        if (this.counter >= this._amount) {
            this.push(null)
        } else {
            const chunkNumbers = Math.min(this._amount - this.counter, this._chunkNumbers)
            const buffer: Buffer = this._getChunkBuffer(chunkNumbers);
            this.push(buffer)
            this.counter += chunkNumbers
        }

    }
    private _getChunkBuffer(count: number): Buffer {
        const array = new Uint32Array(count);
        const range = this._max - this._min + 1;

        for (let i = 0; i < count; i++) {
            array[i] = Math.floor(Math.random() * range) + this._min;
        }
        return Buffer.from(array.buffer);
    }
}