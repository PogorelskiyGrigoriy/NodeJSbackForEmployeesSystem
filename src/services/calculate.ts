import { ServiceError } from "../errors/ServiceError.js";
import { type CalcData } from "../models/CalcData.js";

// Extract operation type directly from the Zod-inferred schema
type OperationType = CalcData['operation'];

// Map operations using a Record to ensure exhaustive implementation of schema keys
const operations: Record<OperationType, (op1: number, op2: number) => number> = {
    add: (op1, op2) => op1 + op2,
    sub: (op1, op2) => op1 - op2,
    mul: (op1, op2) => op1 * op2,
    div: (op1, op2) => {
        if (op2 === 0) throw new ServiceError(400, "op2 cannot be 0");
        return op1 / op2;
    },
    percent: (part, whole) => {
        if (whole === 0) throw new ServiceError(400, "Whole cannot be 0");
        return Number(((part / whole) * 100).toFixed(2));
    },
};

/**
 * Executes the requested arithmetic operation based on validated CalcData.
 */
export default function calculate({ op1, op2, operation }: CalcData): number {
    const opFun = operations[operation];
    
    // Safety check for runtime scenarios or schema mismatches
    if (!opFun) {
        throw new ServiceError(501, `Operation ${operation} is defined in schema but not implemented`);
    }

    return opFun(op1, op2);
}