import { Transform } from "node:stream";
import FilterStream from "./FilterStream.js";
import UniqueStream from "./UniqueStream.js";
import LimitStream from "./LimitStream.js";

/**
 * A Builder class to construct a sequence of Transform streams.
 * Allows for flexible and readable pipeline assembly.
 */
export default class StreamPipelineBuilder {
    private _streams: Transform[] = [];

    /**
     * Adds a filtering stage to the pipeline.
     */
    public filter(predicate: (n: number) => boolean): this {
        this._streams.push(new FilterStream(predicate));
        return this;
    }

    /**
     * Adds a uniqueness constraint to the pipeline.
     */
    public unique(): this {
        this._streams.push(new UniqueStream());
        return this;
    }

    /**
     * Adds a limit to the number of items passed through.
     */
    public limit(count: number): this {
        this._streams.push(new LimitStream(count));
        return this;
    }

    /**
     * Returns the assembled array of transform streams.
     */
    public build(): Transform[] {
        return this._streams;
    }
}