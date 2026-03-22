import { Readable, type ReadableOptions } from "node:stream";

export default class InfiniteRandomObjectStream extends Readable {
    private readonly _min: number;
    private readonly _max: number;

    constructor(
        min: number,
        max: number,
        options: ReadableOptions = {}
    ) {
        super({ ...options, objectMode: true });

        this._min = Math.min(min, max);
        this._max = Math.max(min, max);
    }

    override _read(): void {
        const range = this._max - this._min + 1;

        while (!this.destroyed) {
            const randomNumber = Math.trunc(Math.random() * range) + this._min;
            if (!this.push(randomNumber)) {
                break;
            }
        }
    }
}