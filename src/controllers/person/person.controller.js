const express = require('express');
const createError = require('http-errors');

const personService = require('./person.service');

// Create a new person.
// metódusneveket fogunk felvenni, itt az exports.create-t.
exports.create = (req, res, next) => {
    const { last_name, first_name, email } = req.body;
    if (!last_name || !first_name || !email) {
        // a next() megszakítja a folyamatot és a következő middelwarenek továbbíja a kérést
        return next(new createError.BadRequest('Missing properties'));
    }

    const newPerson = {
        firstName: req.body['first_name'],
        lastName: req.body['last_name'],
        email: req.body['email'],
    };

    return (
        personService
            .create(newPerson)
            .then(cp => {
                res.status(201);
                res.json(cp);
            })
            // beillesztünk egy hibakezelő kódot:
            .catch(err =>
                next(new createError.InternalServerError(err.message))
            )
    );
};

// Read - all
exports.findAll = (req, res, next) => {
    return personService.findAll().then(people => {
        res.json(people);
    });
};

// Read - one
exports.findOne = (req, res, next) => {
    return personService.findOne(req.params.id).then(person => {
        if (!person) {
            return next(new createError.NotFound('Person not found'));
        }
// HIBA A VIDEOBAN : "return person;" helyett az alábbi sor kell a teszthez:        
        return res.json(person);
    });
};

// Update
exports.update = (req, res, next) => {
    const id = req.params.id;
    // az id-t számmá alakítva vizsgáljuk
    const index = data.findIndex(p => p.id === Number(id));
    const { first_name, last_name, email } = req.body;
    if (!last_name || !first_name || !email) {
        return next(new createError.BadRequest('Missing properties'));
    }

    const update = {
        firstName: req.body['first_name'],
        lastName: req.body['last_name'],
        email: req.body['email'],
    };

    return personService
        .update(req.params.id, update)
        .then(person => {
            res.json(person);
        })
        .catch(err => {
            next(new createError.InternalServerError(err.message));
        });
};

// Delete
exports.delete = (req, res, next) => {
    return personService
        .delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => {
            next(new createError.InternalServerError(err.message));
        });
};
