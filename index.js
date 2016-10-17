var express = require('express');
var app = express();
var router = express.Router();
var config = require('config');
//var mongoose = require('mongoose');
 
var api = require('./server/routes')
var bot = require('./bot/bot')

// mongoose.connect('mongodb://localhost:27017/test');

console.log(config.get('verifyToken'))

app.use('/api', api);
app.use('/bot', bot);
app.listen(process.env.PORT || 8080, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});