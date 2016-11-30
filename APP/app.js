const express = require('express');
const path = require('path');
const Apiroutes = require('./server/routes/index');
const Webroutes = require('./client/routes')

const app = express();
app.use('/public',express.static('client'))
app.use('/public', Webroutes);
app.use('/api', Apiroutes);


app.get('/', (req, res, next) => {
	res.redirect('/public')
})

module.exports = app;