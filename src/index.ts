import { pipeline } from "node:stream/promises";
import InfiniteRandomStream from "./RandomNumbersStream.js";
import FilterStream from "./FilterStream.js";
import LimitStream from "./LimitStream.js";
import OutputStream from "./OutputStream.js"; // Не забудь импорт!

async function run() {
    const source = new InfiniteRandomStream(1, 100);
    const filter = new FilterStream(n => n % 10 === 0);
    const limit = new LimitStream(50); 
    const output = new OutputStream("; "); // Создаем наш обработчик вывода

    try {
        await pipeline(
            source,
            filter,
            limit,
            output // Используем наш класс вместо process.stdout
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