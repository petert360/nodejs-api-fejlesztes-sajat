const express = require('express');
const config = require('config'); // config beolvasása
const logger = require('./config/logger');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// ha létezik a config, akkor eelmentjük az értékeket változókba
const {username, password, host} = config.get('database');

// kapcsolódás az adatbázishoz
mongoose
    .connect(
        //'mongodb+srv://dbUser:dbUserPassword@cluster0.6apci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        `mongodb+srv://${username}:${password}@${host}`,
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
// A refaktorálás után erre sorra nincs szükség:
// app.use('/person', require('./controllers/person/routes'));
app.use('/person', require('./controllers/person/person.routes'));
// Beállítjuk a /post URL-t is
app.use('/post', require('./controllers/post/post.routes'));

app.use((err, req, res, next) => {
    //console.error(`ERR ${err.statusCode}: ${err.message}`);
    res.status(err.statusCode);
    res.json({
        hasError: true,
        message: err.message,
    });
});

module.exports = app;