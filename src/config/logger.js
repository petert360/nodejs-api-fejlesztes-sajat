const path = require('path');
const winston = require('winston');

// beállítjuk a logolás opcióit külön a file és console logokra.
const options = {
    file: {
        level: process.env.LOG_LEVEL_FILE,
        filename: path.join(__dirname, '../../app.log'),
        format: winston.format.json(),
    },
    console: {
        level: process.env.LOG_LEVEL_CONSOLE,
    },
};

// létrehozzuk a logger funkciót
const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console),
    ],
    exitOnError: false, // hiba esetén ne álljon le a logolás
});

// a loggerhez létregozunk egy streamet, write() metódussal
logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;