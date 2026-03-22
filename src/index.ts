import http from "node:http"
import calculate from "./service/calculate.js";
import type { CalcData } from "./model/CalcData.js";

const PORT = process.env.PORT || 3000;
const server = http.createServer();

server.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`🚀 Сервер запущен!`);
    console.log(`Доступен локально: http://127.0.0.1:${PORT}`);
    console.log(`Доступен по имени: http://localhost:${PORT}`);
});
server.on("request", (req, res) => {
    res.statusCode = 200
    let result: string = ""
    const calcData = getCalcData(req.url ?? "");
    if (!calcData) {
        res.statusCode = 400;
        result = "wrong request data"
    } else {
        result = calculate(calcData).toString()
    }
    res.end(result)
})

function getCalcData(url: string): CalcData | null {
    const urlTokens: any = url?.split("/")
    let result: CalcData | null = null
    try {
        const op1: number = +urlTokens[2]
        const op2: number = +urlTokens[3]
        const operation: string = urlTokens[1]
        if (isNaN(op1) || isNaN(op2)) throw Error("opearnd must be a number");
        result = {op1, op2, operation}
    } catch (e) { }
    return result;
}
