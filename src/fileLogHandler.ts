import { appendFileSync } from "node:fs"
export const fileHandler = (message: string) => appendFileSync("log.text",message+"\n", {encoding: "utf-8"})