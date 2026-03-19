import readline from 'node:readline/promises';
import { fetchCurrentWeather } from './weather.service.api.js';
import chalk from 'chalk';
import logger from './pino-logger.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    logger.info("Приложение запущено");

    try {
        const city = await rl.question("\nВведите город: ");
        const trimmedCity = city.trim();

        if (!trimmedCity) {
            logger.warn("Пользователь ввел пустую строку");
            console.log(chalk.yellow("Вы не ввели название города."));
            return;
        }

        logger.info({ city: trimmedCity }, "Запрос погоды для города");

        // Пытаемся получить данные
        const data = await fetchCurrentWeather(trimmedCity);
        
        logger.debug(data, "Сырые данные от API получены");

        // Вывод пользователю
        console.log(`\n📍 Город: ${chalk.bold(data.location.name)}, ${data.location.country}`);
        console.log(`☁️ Погода: ${data.current.condition.text}`);
        console.log(`🌡️ Температура: ${chalk.cyan(data.current.temp_c)}°C`);
        console.log(`💧 Влажность: ${data.current.humidity}%`);

        logger.info("Данные успешно выведены пользователю");

    } catch (error: any) {
        // Логируем полную ошибку со всеми деталями (стеком и ответом API)
        const apiError = error.response?.data?.error?.message;
        
        logger.error({
            msg: error.message,
            apiDetail: apiError,
            stack: error.stack,
            status: error.response?.status
        }, "Ошибка в работе приложения");

        console.error(chalk.red("\n❌ Ошибка:"), apiError || error.message);
    } finally {
        logger.info("Закрытие интерфейса ввода и завершение процесса");
        rl.close();
    }
}

// Глобальный отлов ошибок, если что-то упадет вне блока try/catch
main().catch(err => {
    logger.fatal(err, "Критический сбой вне основного цикла");
    process.exit(1);
});