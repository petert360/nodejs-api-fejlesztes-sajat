const path = require('path');
const winston = require('winston');

// beállítjuk a logolás opcióit külön a file és console logokra.
const options = {
    file: {
        level: 'info',
        filename: path.join(__dirname, '../../app.log'),
        format: winston.format.json(),
    },
    console: {
        level: 'debug',
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