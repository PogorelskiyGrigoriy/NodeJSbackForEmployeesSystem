import logger from "./logger.js";

function runLotto() {
    // получаем три числа из терминала в виде строк
    const rawArgs = process.argv.slice(2);

    // Сразу проверяем количество, чтобы linter не ругался
    if (rawArgs.length < 3) {
        return logger.error("Нужно передать 3 аргумента: min, max и count.");
    }

    //  кастим строки в числа
    const min = Number(rawArgs[0]);
    const max = Number(rawArgs[1]);
    const count = Number(rawArgs[2]);

    // проверяем, получилось ли скастить
    if (isNaN(min) || isNaN(max) || isNaN(count)) {
        return logger.error("Все аргументы должны быть числами.");
    }

    // простая проверка на логику
    if (count > (max - min + 1)) {
        return logger.error("В мешке меньше бочонков, чем вы хотите достать!");
    }

    // работаем с Set, чтобы не проверять повторяющиеся числа вручную
    const resultStore = new Set<number>();

    while (resultStore.size < count) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        resultStore.add(randomNum);
    }

    // вывод данных в логгер
    const finalResult = Array.from(resultStore);
    logger.info(`Выпавшие числа: ${finalResult.join(", ")}`);
}

runLotto();