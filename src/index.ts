import app from "./app.js";
import logger from "./pino-logger.js";

const port = Number(process.env.PORT) || 3000;

/**
 * Запуск сервера.
 * Мы используем 0.0.0.0, чтобы сервер был доступен снаружи (например, в Docker).
 */
app.listen(port, "0.0.0.0", () => {
    logger.info(`🚀 Express Server listening on port ${port}`);
});