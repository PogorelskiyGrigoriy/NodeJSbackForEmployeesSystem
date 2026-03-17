import LoggerEmitter, { LogLevel } from "./LoggerEmitter.js";
import { TimeFormatter } from "./TimeFormatter.js";
import { ConsoleHandler } from "./consoleLogHandler.js";
import { FileHandler } from "./fileLogHandler.js";

const formatter = new TimeFormatter();

// 1. Initialize with WARN threshold (only WARN, ERROR, FATAL should pass)
const logger = new LoggerEmitter([
    new ConsoleHandler(formatter),
    new FileHandler("logs.txt", formatter)
], LogLevel.WARN);

console.log("--- START TEST (Threshold: WARN) ---");

// 2. Testing filtration
logger.log("This should NOT appear (INFO < WARN)", LogLevel.INFO);
logger.log("This SHOULD appear (WARN)", LogLevel.WARN);
logger.log("This SHOULD appear (ERROR)", LogLevel.ERROR);

// 3. Testing default level (should be INFO, so it won't appear as INFO < WARN)
logger.log("This is a default level message (INFO)");

// 4. Testing "Invalid" data fallback (simulating JS environment)
// It should fallback to INFO and be filtered out because INFO < WARN
logger.log("Testing invalid level", 999 as any);

console.log("--- CHANGING THRESHOLD TO TRACE ---");

// 5. Test changing threshold at runtime (if you added a setter)
// If you didn't add setMinLevel, you can just create a new instance for this test
const traceLogger = new LoggerEmitter([new ConsoleHandler(formatter)], LogLevel.TRACE);

traceLogger.log("Now TRACE is visible", LogLevel.TRACE);
traceLogger.log("And INFO is also visible", LogLevel.INFO);

console.log("--- TEST FINISHED ---");