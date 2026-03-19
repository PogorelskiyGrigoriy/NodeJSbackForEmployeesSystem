import { performance } from 'node:perf_hooks';
import { pipeline } from 'node:stream/promises';
import { Writable } from 'node:stream';
import { setTimeout } from 'node:timers/promises';
import RandomNumbersStream from './RandomNumbersStream.js';

const TOTAL_NUMBERS = 100_000_000;
const MIN = 1;
const MAX = 100;

/**
 * Вспомогательный класс для "поглощения" данных без записи на диск.
 * Позволяет измерить чистую производительность генератора и стрима.
 */
class DevNull extends Writable {
    processedBytes = 0;
    _write(chunk: Buffer, _encoding: string, callback: (error?: Error | null) => void) {
        this.processedBytes += chunk.length;
        callback();
    }
}

async function runBenchmark() {
    console.log(`🧪 Starting benchmark for ${TOTAL_NUMBERS.toLocaleString()} numbers...`);
    
    // Даем время GC очистить память перед стартом
    await setTimeout(500);

    const stream = new RandomNumbersStream(TOTAL_NUMBERS, MIN, MAX);
    const sink = new DevNull();

    const start = performance.now();

    try {
        await pipeline(stream, sink);
        
        const end = performance.now();
        const duration = (end - start) / 1000;
        const throughput = (TOTAL_NUMBERS / duration) / 1_000_000;
        const dataMB = sink.processedBytes / (1024 * 1024);

        console.log('\n-----------------------------------');
        console.log(`✅ Finished in: ${duration.toFixed(3)} s`);
        console.log(`📊 Speed: ${throughput.toFixed(2)} million numbers/sec`);
        console.log(`📦 Data processed: ${dataMB.toFixed(2)} MB`);
        console.log(`🚀 Bandwidth: ${(dataMB / duration).toFixed(2)} MB/s`);
        console.log('-----------------------------------\n');

    } catch (err) {
        console.error("❌ Benchmark failed:", err);
    }
}

runBenchmark();