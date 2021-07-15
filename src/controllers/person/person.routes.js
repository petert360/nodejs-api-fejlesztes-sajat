// Create a new person.
// A fő url-re hívjuk meg.
// felvesszük a next paraméter függvényt, ami továbbdobja a kérést
// metódusneveket fogunk felvenni, itt az exports.create-t.
controller.post('/', async (req, res, next) => {
    const { last_name, first_name, email } = req.body;
    if (!last_name || !first_name || !email) {
        // a next() megszakítja a folyamatot és a következő middelwarenek továbbíja a kérést
        return next(new createError.BadRequest('Missing properties'));
    }

    // A mongoose létrehoz egy új objektumoot
    const newPerson = new Person({
        firstName: req.body['first_name'],
        lastName: req.body['last_name'],
        email: req.body['email'],
    });

    // Elmentjük az adatbázisba
    newPerson.save().then(data => {
        res.status(201);
        res.json(data);
    });
});

// Update a person.
controller.put('/:id', async (req, res, next) => {
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

    // a { new: true } opció gondoskodik arról, hogy ha nem létezik felhasználó, akkor létrehozza
    // hibakezelés miatt try-catch blokkban
    let person = {};
    try {
        person = await Person.findByIdAndUpdate(id, update, {
            new: true,
            useFindAndModify: false,
        });
    } catch {
        return next(new createError.BadRequest(err));
    }
    return res.json(person);
});

// Delete one person.
// delete metódus segítségével. Az update findIndex részét tudjuk újra hasznosítani
controller.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const person = await Person.findByIdAndDelete(id);
    } catch (err) {
        return next(new createError.NotFound('Person not found'));
    }
    // visszaadhatjuk a tömb új hosszát vagy egy üres objektumot.
    res.json({});
});
