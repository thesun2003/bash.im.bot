var express = require('express');
var app = express();
var router = express.Router();
//var mongoose = require('mongoose');
 
var api = require('./server/routes')

// mongoose.connect('mongodb://localhost:27017/test');

app.use('/api', api);
app.listen(process.env.PORT || 8080, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});