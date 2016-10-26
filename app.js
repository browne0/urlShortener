// require and instantiate express;
var express = require('express');

// Express
var app = express();

// path module needed to concatenate paths
var path = require('path');

// Body-Parser
var bodyParser = require('body-parser');

// Mongoose
var mongoose = require('mongoose');

// MongoDB config
var config = require('./config');

// base58 encoding and decoding functions
var base58 = require('./base58.js');

// get url model
var Url = require('./models/url');

// create connection to our MongoDB
mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);

// handle JSON bodies
app.use(bodyParser.json());

// handle URL encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// serve files from public folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	// route to serve homepage (index.html)
	res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/api/shorten', function(req, res){
	// route to create and return the shortened URL after being given a long URL.
	var longUrl = req.body.url;
	var shortUrl = ''; // shortenedUrl we shall give them. initialize to empty string

	// MONGOOSE QUERY (findOne): Checks every item in collection for an object.
	// If it doesn't find the specific object, an error is returned.
	Url.findOne({long_url: longUrl}, function(err, doc) {
		if (doc) {
			// The URL has already been shortened. base58 encode the unique _id of the doc and construct the url for the user
			shortUrl = config.webhost + base58.encode(doc._id);

			// Since the doc already exists, just return the shortUrl that we retrieved without creating a new entry.
			res.send({'shortUrl': shortUrl});
		} else {
			// The long URL was not found in the long_url field in our URLs colelction,
			// so we need to create a new entry.

			// instantiate a new Url object from our model
			var newUrl = Url({
				long_url: longUrl
			});

			// save this new link (mongoose has a save function built into it for MongoDB)

			newUrl.save(function(err) {
				// if there's an error, log the error
				if (err) {
					console.log(err);
				}

				// otherwise construct the short URL for the user using the encode function from our model.
				shortUrl = config.webhost + base58.encode(newUrl._id);

				// return this new url
				res.send({'shortUrl': shortUrl});
			});
		}
	});
});

app.get('/:encoded_id', function(req, res){
	// route to redirect the visitor to the original URL when given the short URL

	// God bless Express for making dynamic URL parameters super easy
	var base58Id = req.params.encoded_id;

	// decode the _id to use in our decode function from our Url model
	var id = base58.decode(base58Id);

	// MONGOOSE QUERY (findOne): Checks every item in collection for an object.
	// If it doesn't find the specific object, an error is returned.
	Url.findOne({_id: id}, function(err, doc) {
		if (doc) {
			// if there is a document then the entry was found in the database! Redirect them to their destination
			res.redirect(doc.long_url);
		} else {
			// nothing was found, sorry pal
			res.redirect(config.webhost);
		}
	});

});

var server = app.listen(3000, function(){
	console.log('Server now listening on port 3000.');
});