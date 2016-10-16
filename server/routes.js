var app = require('express')();
var mongoose = require('mongoose');
// var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var http = require('http');
var quotes = require('./quotemodel');

iconv.skipDecodeWarning = true;

app.get('/quotes', function(req, res) {
    res.status(200).send('Quotes list');
	console.log('quotes accessed');
});

app.get('/crawl', function(req, res) {
	var url = 'http://bash.im/';

	http.get(url, function(response) {
	  response.pipe(iconv.decodeStream('win1251')).collect(function(err, decodedBody) {
		res.status(200).send(decodedBody);
	  });
	});

	console.log('crawler accessed');
});

module.exports = app;