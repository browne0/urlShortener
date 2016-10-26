// require mongoose module, awesome object data modeling library
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define schema for collection with an _id field and a seq field

var counterSchema = Schema({
	_id: {type: String, required: true},
	seq: {type: Number, default: 0}
});

// create model from schema outlined above
var counter = mongoose.model('counter', counterSchema);

// define another schema for our url collection the same way we did it before.
var urlSchema = new Schema({
	_id: {type: Number, index: true},
	long_url: String,
	created_at: Date
});

// Time to handle requests to change strings.

// every time before an entry is saved to the URLs collection,

urlSchema.pre('save', function(next) {
	var doc = this;

	// find the url_count and increment it by 1
	counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {seq: 1} }, function(error,counter) {
		// if there is an error, return it
		if (error) {
			return next(error);
		}

		// otherwise, set the _id of the URLs collection to the incremented value of the counter.
		doc._id = counter.seq;
		doc.created_at = new Date();
		next();
	});
});

// create model from the URL schema
var Url = mongoose.model('Url', urlSchema);

// export the Url model for use
module.exports = Url;