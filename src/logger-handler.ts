export interface LoggerHandler {
    handler(): (message: string, label: string) => void;
}