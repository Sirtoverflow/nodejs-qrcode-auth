const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

var usersDatabase = [
    { username: 'admin', password: 'admin' },
    { username: 'guest', password: 'guest' },
];

const secretKey = 'your-secret-key';
const usedTokens = new Set();

function generateToken(username) {
    return jwt.sign({ username }, secretKey, { expiresIn: '120s' });
}

function verifyToken(req, res, next) {
    const token = req.query.token;

    if (!token) {
        return res.redirect('/login?error=true');
    }

    if (usedTokens.has(token)) {
        return res.redirect('/login?error=true');
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            res.redirect('/login');
        }

        req.username = decoded.username;
        usedTokens.add(token); 
        console.log(usedTokens);
        next();
    });
}

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname+'/public/views/login.html');

    var qrCode = req.query?.qrcode;
    if (qrCode) {
        sourceQrCode = JSON.parse(qrCode);
        let username = sourceQrCode.username;
        console.log(sourceQrCode.username);
        const userValid = usersDatabase.find(u => u.username === username);
        
        if(!userValid) {
            return res.redirect('/login?error=true');
        }
        const token = generateToken(username);
        res.redirect(`/user?username=${username}&token=${token}`);
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = usersDatabase.find(u => u.username === username && u.password === password);
    const currentUser = username;

    if (user) { 
        const token = generateToken(username);
        res.redirect(`/user?username=${currentUser}&token=${token}`);
    } else {
        res.redirect('/login?error=true');
    }
});

app.get('/register', (req, res) => {
    res.sendStatus(200);
});

app.get('/user', verifyToken, (req, res) => {
    if(!req.query.username) {
        return res.redirect('/login');
    }

    res.sendFile(__dirname+'/public/views/user.html');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
