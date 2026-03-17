import LoggerEmitter from "./LoggerEmitter.js";
import { TimeFormatter } from "./TimeFormatter.js";
import { ConsoleHandler } from "./consoleLogHandler.js";
import { FileHandler } from "./fileLogHandler.js";

const formatter = new TimeFormatter;
const loggerEmitter = new LoggerEmitter([
    new ConsoleHandler(formatter),
    new FileHandler("logs.txt", formatter)
]);
const messages = ["pew", "dew", "mew"]
messages.forEach(msg => loggerEmitter.log(msg));
