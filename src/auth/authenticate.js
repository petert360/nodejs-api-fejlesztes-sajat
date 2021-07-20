const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Kiolvassuk a request headerjei közül az autharization adatokat.
    const authHeader = req.headers.authorization;

    // Kiolvassuk a tokent
    // az authHeader valahogy így néz ki: Bearer fsdlkjgsflgjksflskjfsfs
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // cut the "Bearer" part from the beginning
        // Ellenőrizzük a tokent
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            // Ha hibával tér visssza a verify, a status 403-nem sikerült azonosítani
            if (err) {
                return res.sendStatus(403);
            }
            // Ha nincs hiba:, megkapjuk a usert
            req.user = user;
            next();
        });
    } else { // Ha nincs authHeader:
        res.sendStatus(401);
    }
};
