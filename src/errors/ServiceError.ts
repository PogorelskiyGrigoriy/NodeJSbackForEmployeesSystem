export class ServiceError extends Error {
    constructor(public code: number, public message: string) {
        super(message);
        this.name = "ServiceError";
    }
}