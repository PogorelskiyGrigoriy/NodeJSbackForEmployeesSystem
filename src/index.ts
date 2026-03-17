import logger from "./logger.js";
import LoggerEmitter from "./LoggerEmitter.js";
import { consoleHandler } from "./consoleLogHandler.js";
import { fileHandler } from "./fileLogHandler.js";
const loggerEmitter = new LoggerEmitter([consoleHandler, fileHandler]);
const messages = ["pew","dew","mew"]
messages.forEach(msg => loggerEmitter.log(msg));
