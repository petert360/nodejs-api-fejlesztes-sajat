const express = require('express');
const data = require('./data');

const createError = require('http-errors');
const logger = require('../../config/logger');


const controller = express.Router();

controller.get('/', (req, res) => {
    logger.debug(`Get all persons, returning ${data.length} items.`);
    res.json(data);
});

// Create a new person.
// A fő url-re hívjuk meg.
// felvesszük a next paraméter függvényt, ami továbbdobja a kérést
controller.post('/', (req, res, next) => {
    const { last_name, first_name, email } = req.body;
    if (!last_name || !first_name || !email) {
        // a next() megszakítja a folyamatot és a következő middelwarenek továbbíja a kérést
        return next(new createError.BadRequest('Missing properties'));
    }

    const newPerson = req.body;
    // Az utoltsó indexű objektum id-t kiolvassuk és hozzáadunk egyet.
    newPerson.id = data[data.length - 1].id + 1;
    data.push(newPerson);
    // Sikeres erőforrás létrehozás kódja
    res.status(201);
    res.json(newPerson);
});

// Update a person.
controller.put('/:id', (req, res, next) => {
    const id = req.params.id;
    // az id-t számmá alakítva vizsgáljuk
    const index = data.findIndex(p => p.id === Number(id));
    const { first_name, last_name, email } = req.body;
    if (!last_name || !first_name || !email) {
        return next(new createError.BadRequest('Missing properties'));
    }

    data[index] = {
        id,
        first_name,
        last_name,
        email,
    };
    res.send(data[index]);
});

// Get one person.
// hasonít az összes személy lekéréséhez, de ID alapján csak egyet adunk vissza.
controller.get('/:id', (req, res, next) => {
    const person = data.find(p => p.id === Number(req.params.id));
    if (!person) {
        return next(new createError.NotFound('Person not found'));
    }
    res.json(person);
});

// Delete one person.
// delete metódus segítségével. Az update findIndex részét tudjuk újra hasznosítani
controller.delete('/:id', (req, res, next) => {
    const index = data.findIndex(p => p.id === Number(req.params.id));
    if (index === -1) {
        return next(new createError.NotFound('Person not found'));
    }

    data.splice(index, 1);
    // visszaadhatjuk a tömb új hosszát vagy egy üres objektumot.
    res.json({});
});

module.exports = controller;
