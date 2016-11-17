const express = require('express');
const path = require('path');
const routes = require('./server/routes/index');

const app = express();

app.use(express.static(path.join(__dirname, 'client')));
app.use('/', routes);

module.exports = app;