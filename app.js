require('dotenv').config({ path: './environments/.env' });
var db = require('./db');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const PORT_NUMBER = 8888;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('trust proxy', 1) // trust first proxy

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, authentication');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Content-Type', 'application/json');
    next();
});

require('./api-controller')(app, db);

app.listen(PORT_NUMBER, () => {
    console.log('listening on port ' + PORT_NUMBER);
});
