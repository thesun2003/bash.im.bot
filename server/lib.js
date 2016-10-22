var app = require('express')();
var config = require('config');
var Q = require('Q');
var mongoose = require('mongoose');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var http = require('http');
var quotes = require('./quotemodel');

iconv.skipDecodeWarning = true;

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

function get_random_quote() {
	var deferred = Q.defer();
	
	var url = config.get('abbys_url');

	http.get(url, function(response) {
	  response.pipe(iconv.decodeStream('win1251')).collect(function(err, decodedBody) {
		var quotes_list = get_quotes_from_html(decodedBody);
		var result = rand(quotes_list);

		deferred.resolve(result);
	  });
	});

	return deferred.promise;
}

module.exports = get_random_quote;