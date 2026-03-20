import { Writable } from "node:stream";

/**
 * A Writable stream that outputs data to process.stdout.
 * Implements manual backpressure handling to avoid memory overflows 
 * if the terminal is slower than the data source.
 */
export default class OutputStream extends Writable {
    /**
     * @param _delim - The string used to separate chunks in the output.
     */
    constructor(private _delim: string = "; ") {
        // Enforce objectMode to receive individual items (numbers)
        super({ objectMode: true });
    }

    /**
     * Core logic for writing to the system output.
     * Manages backpressure by listening for the 'drain' event 
     * if the stdout buffer is full.
     */
    override _write(
        chunk: any, 
        encoding: BufferEncoding, 
        callback: (error?: Error | null) => void
    ): void {
        // 1. Check if stdout can accept more data immediately
        const canAcceptMore = process.stdout.write(chunk + this._delim);

        if (!canAcceptMore) {
            // 2. If stdout is full, wait for the 'drain' event before proceeding.
            // This pauses the entire pipeline via the callback mechanism.
            process.stdout.once('drain', () => callback());
        } else {
            // 3. If stdout is ready, acknowledge the write immediately
            callback();
        }
    }

    /**
     * Cleanup logic executed when the stream finishes.
     * Outputs a final newline character.
     */
    override _final(callback: (error?: Error | null) => void): void {
        process.stdout.write("\n");
        callback();
    }
}