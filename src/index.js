require('dotenv').config(); // beolvassa a .env file tartalmát
const config = require('config'); // config beolvasása

const logger = require('./config/logger');
const app = require('./server');

// legyen a port vagy a .env-ben meghatározott, vagy 3000
const port = process.env.PORT || 3000;

// a kapcsolódás előtt megvizsgáljuk, hogy a config megfelelő beállításai léteznek-e
if (!config.has('database')) {
    logger.error('No database config found.');
    process.exit();
}

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
