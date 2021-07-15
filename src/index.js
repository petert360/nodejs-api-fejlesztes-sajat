require('dotenv').config(); // beolvassa a .env file tartalmát
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('./config/logger');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// legyen a port vagy a .env-ben meghatározott, vagy 3000
const port = process.env.PORT || 3000;

// kapcsolódás az adatbázishoz
mongoose
    .connect(
      //'mongodb+srv://dbUser:dbUserPassword@cluster0.6apci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() =>
        logger.info('MongoDB connection has been established successfully')
    )
    .catch(err => {
        logger.error(err);
        process.exit();
    });

// request logging - fontos, hogy a routers betöltése előtt legyen
app.use(morgan('combined', { stream: logger.stream }));

// ha külön images mappűnk van:
// app.use('/images', express.static('images'));
// itt nem kell a public könyvtárat megadni, tudni fogja az express, hogy statikus file-okat szolgál ki innnen:
app.use(express.static('public'));

app.use(bodyParser.json());
app.use('/person', require('./controllers/person/routes'));

app.use((err, req, res, next) => {
    //console.error(`ERR ${err.statusCode}: ${err.message}`);
    res.status(err.statusCode);
    res.json({
        hasError: true,
        message: err.message,
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
