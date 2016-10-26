var config = {};

config.db = {};

// the URL shortening host - shortened URLs will be this + base58 ID

// hosted locally so it will look like: http://localhost:3000/PQwwQ
config.webhost = 'http://localhost:3000/';

// MongoDB host and database name
config.db.host = 'localhost';
config.db.name = 'url_shortener';

module.exports = config;