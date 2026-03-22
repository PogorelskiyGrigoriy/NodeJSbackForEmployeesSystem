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
    
    // Генерируем числа, пока потребитель готов их принимать
    // И пока сам стрим не был уничтожен командой извне
    while (!this.destroyed) {
        const num = Math.floor(Math.random() * range) + this._min;
        
        // push возвращает false, если буфер переполнен или стрим закрыт
        if (!this.push(num)) {
            break; 
        }
    }
}
}