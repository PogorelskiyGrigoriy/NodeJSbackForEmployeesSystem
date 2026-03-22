import { Transform } from "node:stream";
import FilterStream from "./FilterStream.js";
import UniqueStream from "./UniqueStream.js";
import LimitStream from "./LimitStream.js";

interface PipelineConfig {
    transforms: Transform[];
    signal: AbortSignal;
    controller: AbortController;
}

export default class StreamPipelineBuilder {
    private _streams: Transform[] = [];
    // Создаем контроллер внутри билдера по умолчанию
    private _controller: AbortController = new AbortController();

    public filter(predicate: (n: number) => boolean): this {
        this._streams.push(new FilterStream(predicate));
        return this;
    }

    public unique(): this {
        this._streams.push(new UniqueStream());
        return this;
    }

    /**
     * Теперь контроллер передавать не нужно, билдер использует свой.
     */
    public limit(count: number): this {
        this._streams.push(new LimitStream(count, this._controller));
        return this;
    }

    /**
     * Возвращает объект с массивом стримов и сигналом для pipeline.
     */
    public build(): PipelineConfig {
        return {
            transforms: this._streams,
            signal: this._controller.signal,
            controller: this._controller 
        };
    }
}