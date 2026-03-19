import 'dotenv/config';
import readline from 'node:readline/promises';
import { fetchCurrentWeather } from './weather.service.api.js';
import chalk from 'chalk';
import logger from './pino-logger.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    logger.info("Application started");

    // Using a loop instead of recursion to prevent stack overflow and finally-traps
    while (true) {
        try {
            const city = await rl.question("\nEnter city name (or 'exit' to quit): ");
            const trimmedCity = city.trim();

            // 1. Exit handling
            if (trimmedCity.toLowerCase() === 'exit') {
                console.log(chalk.blue("Goodbye!"));
                logger.info("User exited the application");
                break; // Cleanly exits the while loop
            }

            // 2. Validation
            if (!trimmedCity) {
                logger.warn("Empty input provided");
                console.log(chalk.yellow("City name cannot be empty."));
                continue; // Skips to the next iteration of the loop
            }

            logger.info({ city: trimmedCity }, "Fetching weather data");

            // 3. API Request
            const data = await fetchCurrentWeather(trimmedCity);
            logger.debug(data, "Raw API data received");

            // 4. Output Display
            console.log(`\n📍 City: ${chalk.bold(data.location.name)}, ${data.location.country}`);
            console.log(`☁️  Condition: ${data.current.condition.text}`);
            console.log(`🌡️  Temperature: ${chalk.cyan(data.current.temp_c)}°C`);
            console.log(`💧 Humidity: ${data.current.humidity}%`);

            logger.info("Weather data successfully displayed");

        } catch (error: any) {
            // 5. Error Handling
            const apiError = error.response?.data?.error?.message;
            logger.error({ msg: error.message, apiDetail: apiError }, "Runtime error");
            console.error(chalk.red("\n❌ Error:"), apiError || error.message);
            
            // The loop continues automatically after catch
        }
    }

    // 6. Cleanup (executed only after 'break')
    rl.close();
    logger.info("Application closed properly");
}

main().catch(err => {
    logger.fatal(err, "Critical failure");
    process.exit(1);
});