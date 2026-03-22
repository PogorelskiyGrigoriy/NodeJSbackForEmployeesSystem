import { Transform, type TransformCallback } from "node:stream";

export default class LimitStream extends Transform {
    private _current: number = 0;

    /**
     * @param _limit - Максимальное количество элементов
     * @param _controller - Экземпляр AbortController для управления жизненным циклом пайплайна
     */
    constructor(
        private _limit: number, 
        private _controller: AbortController 
    ) {
        super({ objectMode: true });
    }

    override _transform(
    chunk: any, 
    encoding: BufferEncoding, 
    callback: TransformCallback
): void {
    // 1. Увеличиваем счетчик и проталкиваем данные
    this._current++;
    this.push(chunk);

    // 2. Если достигли лимита
    if (this._current >= this._limit) {
        this._controller.abort();
        // ВАЖНО: Мы НЕ вызываем callback() после abort.
        // Мы просто выходим. Это предотвращает запрос новых данных у источника.
        return; 
    }

    // 3. Если лимит не достигнут, просим следующую порцию
    callback();
}
}