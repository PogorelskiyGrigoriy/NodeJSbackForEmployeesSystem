import { Writable } from "node:stream";

export default class OutputStream extends Writable {
    constructor(private _delim: string = "; ") {
        super({ objectMode: true })
    }
    // Specification: chunk is a number
    override _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
        // 1. Проверяем, готов ли stdout принять данные
        const canAcceptMore = process.stdout.write(chunk + this._delim);

        if (!canAcceptMore) {
            // 2. Если консоль переполнена, ждем события 'drain' (очистка)
            // Только после этого вызываем callback, чтобы цепочка продолжила работу
            process.stdout.once('drain', () => callback());
        } else {
            // 3. Если всё ок, сразу подтверждаем получение
            callback();
        }
    }
    override _final(callback: (error?: Error | null) => void): void {
        process.stdout.write("\n")
        callback()
    }
}