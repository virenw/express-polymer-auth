const express = require('express');
const app = express();
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const User = require('./db').User;

app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static(path.join(__dirname, 'views')));
//app.set('views', path.join(__dirname, 'views'));
app.use(favicon(path.join(__dirname, 'views', 'favicon.ico')));

/*app.get('/', (req, res, next) => {
    res.send("Hello World!")
});*/

app.get('/users', (req, res, err) => {
    User.all((err, users) => {
        res.send(users)
    });
});

app.post('/user', (req, res, next) =>{
    const uname = req.body.username;
    const pwd = req.body.pass
    User.create(
        { username: uname, pass: pwd }, 
        (err, user) => {
            if(err) console.log(err);
            else res.redirect('/');
        }
    );
});

app.listen(3000);