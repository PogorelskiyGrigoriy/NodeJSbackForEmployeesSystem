import { EventEmitter } from 'node:events';
import type { LoggerHandler } from './LoggerHandler.js';

export default class LoggerEmitter extends EventEmitter {
    constructor(handlers: LoggerHandler[] = []) {
        super();
        // Подписываем результат выполнения метода handler()
        handlers.forEach(h => this.on("message", h.handler()));
    }

    log(message: string): void {
        this.emit("message", message);
    }

    // Приводим к единому стандарту — принимаем объект интерфейса
    setHandler(handler: LoggerHandler) {
        this.on("message", handler.handler());
    }
}