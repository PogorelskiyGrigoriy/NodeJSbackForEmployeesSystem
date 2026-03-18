import type { LoggerHandler } from "./logger-handler.js";
import type { LoggerFormatter } from "./logger-formatter.js";

export class TelegramHandler implements LoggerHandler {
    constructor(private _formatter: LoggerFormatter) {}

    handler(): (message: string, label: string) => void {
        return (message: string, label: string) => {
            const formattedMessage = this._formatter.format(message, label);
            
            // Имитация отправки в Telegram
            console.warn("\n[TELEGRAM BOT] 🚀 Sending emergency alert to Admin...");
            console.warn(`[TELEGRAM BOT] Content: ${formattedMessage}`);
        };
    }
}