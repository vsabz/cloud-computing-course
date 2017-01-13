// Request.js is a file to test the Apllication1.js

// Imports
var request = require('request');

var name = [{"Name": "ASU"}];
request({
	url: 'http://localhost:9000/graduate',
	qs: {from: 'example', time: +new Date()},
	method: 'POST',
	json: { "university": name}
}, function(error, response, body){
	if(error){
	console.log(error);
	} else {
		console.log(response.statusCode, body);
}
});
