var app = require('express')();
var get_random_quote = require('./lib')

app.get('/quote', function(req, res) {

	get_random_quote()
		.then(function(result) {
			res.status(200).send(result);
		});

	console.log('quotes accessed');
});

app.get('/crawl', function(req, res) {
	// should crawl website and put quoutes to database
	console.log('crawler accessed');
});

module.exports = app;