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

	app.use(express.static(__dirname + '/statics'));

	app.get('/', function (req, res) {
		res.sendFile(__dirname + '/statics/index.html')
	});

	app.get('/addBulk', function (req, res) {
		res.sendFile(__dirname + '/statics/addBulk.html')
	});

	
	app.post('/scan', requestHandlers.scan);
	app.post('/getStudents', requestHandlers.getStudents);
	app.post('/getIds', requestHandlers.getIds);
	app.post('/add', requestHandlers.addStudent);
	app.post('/edit', requestHandlers.editStudent);
	app.post('/overView', requestHandlers.overView);
	app.post('/close', function(){
		console.log(123);
		process.exit(code=0);
	});
	var server = app.listen(8080);
	
	console.log("Server has started");
}

exports.start = start;