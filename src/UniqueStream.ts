import { Transform, type TransformCallback } from "node:stream";

/**
 * Стрим-трансформер для фильтрации дубликатов.
 * Работает в objectMode, пропуская только те значения, которые еще не встречались.
 */
export default class UniqueStream extends Transform {
    // Используем Set для максимально быстрого поиска (O(1))
    private _seen: Set<number> = new Set();

    constructor() {
        super({ objectMode: true });
    }

    override _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
        // Проверяем, видели ли мы это число раньше
        if (!this._seen.has(chunk)) {
            // Если нет — сохраняем его и проталкиваем дальше по цепочке
            this._seen.add(chunk);
            this.push(chunk);
        }
        
        // В любом случае вызываем callback, чтобы получить следующий чанк
        callback();
    }

    // Очищаем память после завершения работы стрима
    override _flush(callback: TransformCallback): void {
        this._seen.clear();
        callback();
    }
}