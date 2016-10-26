// We will be using base58 in order to encode each unique id of each string using bijection.

// First, let's create a string with all the characters we will use in our encoding algorithm.
var chars = "123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var base = chars.length; // base is length of chars variable (base58) so it should be 58

// convert base10 integer (our URL id) to base58 string (our encoded ending to our url)
function encode(num) {
	var encoded = '';

	while(num) {
		var remainder = num % base;
		num = Math.floor( num / base);
		encoded += chars[remainder].toString();
	}

	return encoded;
}

// convert base58 string (our encoded ending to our url) to base10 integer (our url ID)

function decode(str) {
	var decoded = 0;
	while(str) {

		// find the index of the char in our string
		var index = chars.indexOf(str[0]);
		var pow = str.length - 1;
		decoded += index * (Math.pow(base, pow));

		// move on to the next character
		str = str.substring(1);
	}

	return decoded;
}

module.exports.encode = encode;
module.exports.decode = decode;