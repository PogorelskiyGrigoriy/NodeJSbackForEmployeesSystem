export interface LoggerFormatter {
    // Add optional label parameter to the contract
    format(message: string, label?: string): string;
}