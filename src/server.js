const express = require('express');
const config = require('config'); // config beolvasása
const logger = require('./config/logger');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

// swagger docs
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Authentication
const authenticateJwt = require('./auth/authenticate');
const adminOnly = require('./auth/adminOnly');

const swaggerDocument = YAML.load('./docs/swagger.yaml');

// ha létezik a config, akkor elmentjük az értékeket változókba
const { username, password, host } = config.get('database');

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

// Ha az url /login és post kérést kaptunk, akor a login.js middleware fog lefutni
app.post('/login', require('./auth/login'));

// Beékelhetünk több middleware-t, előbb az authenticatejwt, ami az authenticate.js-ben szereplően vizsgálaja az authorizációt és a usert elhelyezi a kérésben.
// A /person url-t az érheti el, aki be van jelentkezve
app.use('/person', authenticateJwt, require('./controllers/person/person.routes'));
// A /post url-t az érheti el, aki be van jelentkezve és admin
app.use('/post', authenticateJwt, adminOnly, require('./controllers/post/post.routes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
    //console.error(`ERR ${err.statusCode}: ${err.message}`);
    res.status(err.statusCode);
    res.json({
        hasError: true,
        message: err.message,
    });
});

module.exports = app;
