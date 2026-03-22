import type { CalcData } from "../model/CalcData.js";
const operations: Map<string, (op1: number, op2: number) => number> = new Map([
    ["add", (op1, op2) => op1 + op2],
    ["sub", (op1, op2) => op1 - op2],
    ["mult", (op1, op2) => op1 * op2],
    ["div", (op1, op2) => op1 / op2],
]);

export default function calculate(data: CalcData): number | string {
    const { op1, op2, operation } = data;
    
    const execute = operations.get(operation);
    
    if (!execute) {
        return "Unknown operation";
    }

    return execute(op1, op2);
}