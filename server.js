var http = require("http");
var url = require("url");
var requestHandlers = require("./requestHandlers");
function start() {

	var express = require('express');
	app = express();
	var bodyParser = require('body-parser')
	
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	  extended: true
	})); 
	var json = require('express-json');
	app.use(json())

	app.use(express.static(__dirname + '/clientSide'));
	app.use(express.static(__dirname + '/media'));

	app.get('/', function (req, res) {
		res.sendFile(__dirname + '/html/index.html')
	});

	
	
	app.get('/test', requestHandlers.test);
	
	app.post('/close', function(){
		console.log(123);
		process.exit(code=0);
	});
	var server = app.listen(8080);
	var io = require('socket.io')(server);
	io.on('connection', function (socket) {

		socket.join('the best room')
		socket.emit('news', { hello: 'world' });
			socket.on('my other event', function (data) {
			console.log(data);
		});
	});



	
	console.log("Server has started");
}

exports.start = start;