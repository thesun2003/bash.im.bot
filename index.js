var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
 
var api = require('./Server/routes')

mongoose.connect('mongodb://localhost:27017/test');

app.use('/api', api);
app.listen(process.env.PORT || 8080);
