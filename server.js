// server.js
// where your node app starts

// init project
const express   = require('express');
const app       = express();
const mysql     = require('mysql');
const path      = require('path');
var bodyParser  = require('body-parser');
var cors        = require('cors');

//Environment variables
const DB_PASS = process.env.DB_PASS;
const DB_USER = process.env.DB_USER;

const db = mysql.createConnection ({
    host: 'mysql.casamentogife.com.br',
    user: DB_USER,
    password: DB_PASS,
    database: 'gife_wedding'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
