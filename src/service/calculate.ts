import type { CalcData } from "../model/CalcData.js";

// 1. Определяем класс ошибки, если его еще нет
export class ServiceError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "ServiceError";
    }
}

const operations: Map<string, (op1: number, op2: number) => number> = new Map([
    ["add", (op1, op2) => op1 + op2],
    ["sub", (op1, op2) => op1 - op2],
    ["mult", (op1, op2) => op1 * op2],
    ["div", (op1, op2) => {
        if (op2 === 0) throw new ServiceError(400, "op2 cant be 0");
        return op1 / op2;
    }],
    ["percent", (op1, op2) => {
        if (op2 === 0) throw new ServiceError(400, "op2 cant be 0");
        const result = (op1 / op2) * 100;
        return Number(result.toFixed(2));
    }],
]);

export default function calculate(data: CalcData): number {
    const { op1, op2, operation } = data;
    const execute = operations.get(operation);

    if (!execute) {
        throw new ServiceError(404, `Unknown operation: ${operation}`);
    }

    return execute(op1, op2);
}