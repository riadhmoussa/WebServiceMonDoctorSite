const express = require('express');
const app = express();
const medecinRouter = require('./api/routes/medecin');

const morgan = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

app.use('/medecin',medecinRouter);

 module.exports = app;