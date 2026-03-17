export interface LoggerFormatter {
    format(message: string): string;
}