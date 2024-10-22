const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session')

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'random-string',
    resave: true,
    saveUninitialized: true
}))

// Constants

const mockUsers = [
    { username: 'yagev', password: 'yagev123'},
    { username: 'synclair', password: 'synclair123'}
]

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    if (req.session.user){
        res.sendFile(path.join(__dirname, 'public', 'protected.html'));
    }
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const {
        body: {
            username,
            password
        }
    } = req;
    const userIndex = mockUsers.findIndex((user) => username === user.username && password === user.password)
    if (userIndex === -1) {
        return res.status(401).json({ status: 'error' })
    }
    req.session.user = { username, password };
    res.redirect('/protected');
});

app.get('/protected', (req, res) => {
    console.log(req.session.user)
    if (req.session.user){
        console.log('verified user')
        res.sendFile(path.join(__dirname, 'public', 'protected.html'));
    }
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
