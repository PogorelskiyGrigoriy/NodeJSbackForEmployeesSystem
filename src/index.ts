import { pipeline } from "node:stream/promises";
import InfiniteRandomStream from "./RandomNumbersStream.js";
import FilterStream from "./FilterStream.js";
import LimitStream from "./LimitStream.js";
import OutputStream from "./OutputStream.js";
import UniqueStream from "./UniqueStream.js";

async function run() {
    const source = new InfiniteRandomStream(1, 100);
    const filter = new FilterStream(n => n % 2 === 0);
    const unique = new UniqueStream();
    const limit = new LimitStream(45); 
    const output = new OutputStream("; ");
    

    try {
        await pipeline(
            source,
            filter,
            unique,
            limit,
            output
        );
        console.log("\n\n✅ Done! Stream stopped by LimitStream.");
    } catch (err: any) {
    if (err.code === 'ERR_STREAM_PREMATURE_CLOSE') {
        // Используем setImmediate, чтобы дождаться очистки буферов stdout
        setImmediate(() => {
            console.log("\n✅ Done! Stream stopped by LimitStream.");
        });
    } else {
        console.error("❌ Pipeline failed:", err);
    }
}
}

run();