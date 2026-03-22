import pino from "pino";
import fs from "node:fs";
import pretty from "pino-pretty";

// Константы для путей (удобнее менять в одном месте)
const LOGS_DIR = "./logs";
const COMBINED_LOG = `${LOGS_DIR}/combined.log`;
const ERRORS_LOG = `${LOGS_DIR}/errors.log`;

const logLevel = process.env.LOGGER_LEVEL || 'info';

if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// 3. Настройка "красивого" стрима для консоли
const prettyStream = pretty({
    colorize: true,
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname', // убираем лишний шум для разработки
    singleLine: false,      // если объекты большие, лучше видеть их развернутыми
});

const streams: pino.StreamEntry[] = [
    // Консоль: теперь здесь не сырой JSON, а отформатированный текст
    { 
        level: logLevel as pino.Level, 
        stream: prettyStream 
    },
    // Общий файл: сюда пишем сырой JSON (стандарт для продакшена)
    { 
        level: logLevel as pino.Level, 
        stream: pino.destination({ dest: COMBINED_LOG, sync: true }) 
    },
    // Ошибки: только критические моменты
    { 
        level: 'error', 
        stream: pino.destination({ dest: ERRORS_LOG, sync: true }) 
    }
];

const logger = pino(
    {
        level: logLevel,
    },
    pino.multistream(streams)
);

export default logger;