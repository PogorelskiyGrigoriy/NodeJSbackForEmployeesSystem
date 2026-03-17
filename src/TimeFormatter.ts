import type { LoggerFormatter } from "./LoggerFormatter.js";

// Определяем тип для настроек, чтобы было удобно расширять
export interface TimeFormatterOptions {
    timeZone?: string;
    locale?: string;
    includeDate?: boolean;
}

export class TimeFormatter implements LoggerFormatter {
    private readonly _intlFormatter: Intl.DateTimeFormat;

    constructor(options: TimeFormatterOptions = {}) {
        const {
            // Приоритет: переданная зона -> переменная окружения -> дефолт
            timeZone = process.env.TZ || "Asia/Jerusalem",
            locale = "en-GB", // Стабильный формат (DD/MM/YYYY)
            includeDate = true
        } = options;

        try {
            this._intlFormatter = new Intl.DateTimeFormat(locale, {
                timeZone,
                dateStyle: includeDate ? "short" : undefined,
                timeStyle: "medium",
                hour12: false
            });
        } catch (error) {
            // Если таймзона невалидная, откатываемся на UTC, чтобы приложение не упало
            console.warn(`Invalid timezone "${timeZone}", falling back to UTC.`);
            this._intlFormatter = new Intl.DateTimeFormat(locale, {
                timeZone: "UTC",
                dateStyle: "short",
                timeStyle: "medium"
            });
        }
    }

    format(message: string): string {
        const timestamp = this._intlFormatter.format(Date.now());
        return `[${timestamp}] ${message}`;
    }
}