import LoggerEmitter from "./LoggerEmitter.js";
import { ConsoleHandler } from "./consoleLogHandler.js";
import { FileHandler } from "./fileLogHandler.js";

const loggerEmitter = new LoggerEmitter([new ConsoleHandler,new FileHandler("logs.txt")]);
const messages = ["pew","dew","mew"]
messages.forEach(msg => loggerEmitter.log(msg));
