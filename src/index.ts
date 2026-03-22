import { pipeline } from "node:stream/promises";
import InfiniteRandomStream from "./RandomNumbersStream.js";
import OutputStream from "./OutputStream.js";
import StreamPipelineBuilder from "./StreamPipelineBuilder.js";

async function run() {
    const source = new InfiniteRandomStream(1, 100);
    const output = new OutputStream("; ");
    
    // Билдер теперь возвращает объект с массивом трансформаций и сигналом
    const { transforms, signal } = new StreamPipelineBuilder()
        .filter(n => n % 2 === 0)
        .unique() 
        .limit(40) // Теперь лимит сам знает о внутреннем контроллере
        .build();

    try {
        // Передаем извлеченный сигнал в опции pipeline
        await pipeline(source, ...transforms, output, { signal });
        
        console.log("\n✅ Пайплайн завершен штатно");
    } catch (err: unknown) {
        // Используем проверку на Error для типобезопасности вместо any
        if (err instanceof Error && err.name === 'AbortError') {
            console.log("\n🛑 Пайплайн остановлен: лимит достигнут");
        } else {
            console.error("\n❌ Произошла критическая ошибка:", err);
        }
    } finally {
        console.log("\n--- Завершение работы пайплайна ---");
        console.log("Это сообщение выведется ВСЕГДА");
    }
}

run();