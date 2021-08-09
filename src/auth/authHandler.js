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
module.exports.refresh = (req, res, next) => {
    // Kiolvassuk a meglévő tokent:
    const { token } = req.body;

    // Ha nincs token:
    if (!token) {
        return res.sendStatus(401);
    }

    // Ha van token, de ne mazonos, nem szerepel a listánkban:
    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    // Ellenőrizzük a tokent
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        // Ha hibával tér visssza a verify, a status 403-nem sikerült azonosítani
        if (err) {
            return res.sendStatus(403);
        }
        // Ha nincs hiba, új tokent állítunk ki:
        const accessToken = jwt.sign({
            username: user.username,
            role: user.role
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRY
        });
            
        res.json({
            accessToken
        });
    });
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

// Felhasználó kijelentkeztetése
module.exports.logout = (req, res) => {
    const { token } = req.body;

    if (refreshTokens.includes(token)) {
        res.sendStatus(403);
    }

    const tokenIndex = refreshTokens.indexOf(token);
    refreshTokens.splice(tokenIndex, 1);

    res.sendStatus(200);
};
