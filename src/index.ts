import { pipeline } from "node:stream/promises";
import InfiniteRandomStream from "./RandomNumbersStream.js";
import FilterStream from "./FilterStream.js";
import LimitStream from "./LimitStream.js";
import OutputStream from "./OutputStream.js";
import UniqueStream from "./UniqueStream.js";

async function run() {
    const source = new InfiniteRandomStream(1, 100);
    const filter = new FilterStream(n => n % 2 === 0);
    const limit = new LimitStream(45); 
    const output = new OutputStream("; ");
    const unique = new UniqueStream;

    try {
        await pipeline(
            source,
            filter,
            unique,
            limit,
            output
        );
        console.log("\n✅ Done! Stream stopped by LimitStream.");
    } catch (err: any) {
        // pipeline бросает ошибку при destroy(), если не передать { signal }
        // Но в данном случае мы просто ловим завершение
        if (err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
            console.error("❌ Pipeline failed:", err);
        }
    }
}

run();