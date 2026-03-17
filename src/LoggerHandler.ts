export interface LoggerHandler {
    handler(): (message: string) => void
}