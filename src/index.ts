import { pipeline } from "node:stream/promises";
import InfiniteRandomStream from "./RandomNumbersStream.js";
import OutputStream from "./OutputStream.js";
import StreamPipelineBuilder from "./StreamPipelineBuilder.js";

async function run() {
    const source = new InfiniteRandomStream(1, 200);
    const output = new OutputStream("; ");

    const transforms = new StreamPipelineBuilder()
        .filter(n => n % 2 === 0)
        .unique()                 
        .limit(30)              
        .build();              

    try {
        await pipeline(
            source,
            ...transforms,
            output
        );
    } catch (err: any) {
        if (err.code === 'ERR_STREAM_PREMATURE_CLOSE') {
            console.log("\n✅ Done! Stream stopped by LimitStream.");
        } else {
            console.error("❌ Pipeline failed:", err);
        }
    }
}

run();