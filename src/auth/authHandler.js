const jwt = require('jsonwebtoken');

// Felhasználók adatbázisa:
const Users = [
    {
        username: 'admin',
        password: 'admin_pw',
        role: 'admin',
    },
    {
        username: 'user',
        password: 'user_pw',
        role: 'user',
    },
];

// a frissítő tokeneket tömbben tároljuk el
const refreshTokens = [];

// authenticate.js-ből
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

//login.js-ből érkezett
module.exports.login = (req, res) => {
    // Read username and password from request body
    const { username, password } = req.body;

    // Filter user from the users array by username and password
    const user = Users.find(u => {
        return u.username === username && u.password === password;
    });

    if (user) {
        // Generate an access token
        const accessToken = jwt.sign({
            username: user.username,
            role: user.role
        },  process.env.ACCESS_TOKEN_SECRET, {
             expiresIn: process.env.TOKEN_EXPIRY
        });

        const refreshToken = jwt.sign({
            username: user.username, 
            role: user.role
        }, process.env.REFRESH_TOKEN_SECRET);
        // Elmentjük a tömbbe
        refreshTokens.push(refreshToken);
        
        res.json({
            accessToken,
            refreshToken
        });
    } else {
        res.send('Username or password incorrect');
    }
};
