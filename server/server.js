const express = require('express')
const path = require('path')
const app = express()
const dataBase = require('nedb')
const bodyParser = require('body-parser')
const session = require('express-session')
const port = process.env.port || 5500
//*app use && DB
app.use(express.static(__dirname + '/static'))
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({
    secret: "key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        // maxAge: 1000 * 60 * 60 * 24 * 365
    },
}))
app.set('trust proxy', true)

const pokojeAktualne = new dataBase({
    filename: './static/database/rozgrywka.db',
    autoload: true
});
const historia = new dataBase({
    filename: './static/database/historia.db',
    autoload: true
});
//!!! end of app user
//* requires 
require("colors");
require('./static/scripts/routing_and_posts')(app, path, __dirname, pokojeAktualne);

//!!!end of reqirements








app.listen(port, () => console.log(`Serwer zasuwa na PORCIE :  ${port}!`.red))