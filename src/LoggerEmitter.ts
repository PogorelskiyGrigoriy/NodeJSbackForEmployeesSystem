import { EventEmitter } from 'node:events';
export default class LoggerEmitter extends EventEmitter {
    constructor(handlers: ((message: string) => void)[] = []) {
        super();
        handlers.forEach(h => this.on("message", h))
    }
    log(message: string): void {
        this.emit("message", message)
    }
    setHandler(handler: (message:string) => void){
        this.on("message", handler)
    }

}