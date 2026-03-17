import type { LoggerFormatter } from "./LoggerFormatter.js";

// Configuration options for time formatting
export interface TimeFormatterOptions {
    timeZone?: string;
    locale?: string;
    includeDate?: boolean;
}

export class TimeFormatter implements LoggerFormatter {
    private readonly _intlFormatter: Intl.DateTimeFormat;

    constructor(options: TimeFormatterOptions = {}) {
        const {
            // Priority: provided zone -> env variable -> default
            timeZone = process.env.TZ || "Asia/Jerusalem",
            locale = "en-GB", // Standard DD/MM/YYYY format
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
            // Fallback to UTC to prevent application crash on invalid timezone
            console.warn(`Invalid timezone "${timeZone}", falling back to UTC.`);
            this._intlFormatter = new Intl.DateTimeFormat(locale, {
                timeZone: "UTC",
                dateStyle: "short",
                timeStyle: "medium"
            });
        }
    }

    // Update signature to include optional log level label
    format(message: string, label?: string): string {
        const timestamp = this._intlFormatter.format(Date.now());
        
        // Build prefix: include label in brackets if provided
        const prefix = label ? `[${timestamp}] [${label}]` : `[${timestamp}]`;
        
        return `${prefix} ${message}`;
    }
}