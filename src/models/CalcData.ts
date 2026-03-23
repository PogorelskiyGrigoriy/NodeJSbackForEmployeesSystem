import { z } from "zod";

/**
 * Zod validation schema for calculator request data.
 * Ensures inputs are numeric and operations are supported.
 */
export const CalcDataSchema = z.object({
    // Validate operands: must be present and numeric
    op1: z.coerce.number({ message: "op1 is required and must be a number" }),
    op2: z.coerce.number({ message: "op2 is required and must be a number" }),
    
    // Validate operation: must match the defined list of supported literals
    operation: z.enum(["add", "sub", "mul", "div", "percent"] as const, {
        message: "Unsupported operation. Use: add, sub, mul, div, percent"
    })
});

/**
 * Infers a TypeScript type directly from the Zod schema.
 * This keeps the code DRY (Don't Repeat Yourself).
 */
export type CalcData = z.infer<typeof CalcDataSchema>;