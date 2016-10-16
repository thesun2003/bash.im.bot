var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var quotes = new Schema({
	id: { type: Number, required: true }, 
	text: { type: String, required: true },
	source: { type: String, required: true, default: 'top' },
	date: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('quotes', quotes);
