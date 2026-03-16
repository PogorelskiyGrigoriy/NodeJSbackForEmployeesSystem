import logger from "./logger.js";

function runLotto() {
    // Get three numbers from the terminal as strings
    const rawArgs = process.argv.slice(2);

    // Cast strings to numbers
    const min = Number(rawArgs[0]);
    const max = Number(rawArgs[1]);
    const count = Number(rawArgs[2]);

    // Validate if the casting was successful
    if (isNaN(min) || isNaN(max) || isNaN(count)) {
        return logger.error("All arguments must be valid numbers.");
    }

    // Simple logic check
    if (count > (max - min + 1)) {
        return logger.error("The pool is smaller than the requested amount of numbers!");
    }

    // Use a Set to avoid checking for duplicate numbers manually
    const resultStore = new Set<number>();

    while (resultStore.size < count) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        resultStore.add(randomNum);
    }

    // Output data to the logger
    const finalResult = Array.from(resultStore);
    logger.info(`Drawn numbers: ${finalResult.join(", ")}`);
}

runLotto();
// npm run dev -- 1 100 6