var app = require('express')();
var config = require('config');
var qp = require('q');
var mongoose = require('mongoose');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var https = require('https');
var quotes = require('./quotemodel');

var delimiter = '0123210';
iconv.skipDecodeWarning = true;

function rand(items){
    return items[~~(Math.random() * items.length)];
}

function get_quotes_from_html(decodedBody) {
  	$ = cheerio.load(decodedBody);

	var DOMquotes = $(".quote .text");
	var quotes_list = []

  	DOMquotes.each(function(index, item) {
  		var quote = $(item).text().replace(new RegExp(delimiter, 'gi'), "\n");
  		quotes_list.push(quote);
  	});

  	return quotes_list;
}

function get_random_quote() {
	var deferred = qp.defer();
	
	var url = config.get('abbys_url');

	https.get(url, function(response) {
	  response.pipe(iconv.decodeStream('win1251'))
	  	.collect(function(err, decodedBody) {
		  	var body = decodedBody.replace(/<br>/gi, delimiter);

			var quotes_list = get_quotes_from_html(body);
			var result = rand(quotes_list);

			deferred.resolve(result);
	  });
	});

	return deferred.promise;
}

module.exports = get_random_quote;