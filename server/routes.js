var app = require('express')();
var config = require('config');
var mongoose = require('mongoose');
// var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var http = require('http');
var quotes = require('./quotemodel');

function rand(items){
    return items[~~(Math.random() * items.length)];
}

function get_quotes_from_html(decodedBody) {
  	$ = cheerio.load(decodedBody);

	var DOMquotes = $(".quote .text");
	var quotes_list = []

  	DOMquotes.each(function(index, item) {
  		quotes_list.push($(item).html());
  	});

  	return quotes_list;
}

iconv.skipDecodeWarning = true;

app.get('/quote', function(req, res) {
	var url = config.get('abbys_url');

	http.get(url, function(response) {
	  response.pipe(iconv.decodeStream('win1251')).collect(function(err, decodedBody) {
		var quotes_list = get_quotes_from_html(decodedBody);
		
		res.status(200).send(rand(quotes_list));
	  });
	});
	console.log('quotes accessed');
});

app.get('/crawl', function(req, res) {
	// should crawl website and put quoutes to database
	console.log('crawler accessed');
});

module.exports = app;