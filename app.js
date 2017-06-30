var express = require('express');
var routes = require('./routers/index');
var app = express();

app.use(routes);


module.exports = app;