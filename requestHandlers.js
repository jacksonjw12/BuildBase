var io
var locations = [ {"name":"AAAABB","x":100,"y":100}, {"name":"BABCDC","x":200,"y":100}]

//playerexample = {"Socket":socket, "Location":{"x":42,"y",24}, "Rotation":90, "IGN":"Richard Wang", GameRoom:bestgame}
//gameroom example = {"name":abcd, }

//var worlds = {
	//"Players":[]
	//"GameRooms":[]
//}


function test(req, res){
	console.log("eyy lmao")
	res.send("hey");
}

function initializeSockets(server){
	io = require('socket.io')(server);
	io.on('connection', function (socket) {
		//allClients.push(socket);
		socket.join('gameRoom1')
		socket.emit('locations', {"locations": locations});
		socket.on('myLocation', function (data) {
				
				found = false;
				for(var i = 0; i< locations.length; i++){
					if(locations[i].name == data.name){
						locations[i].x = data.x
						locations[i].y = data.y
						found = true;
					}

				}
				if(!found){
					locations.push({"name":data.name,"x":data.x,"y":data.y})
					console.log("added a new player " + data.name)
				}
				socket.emit('locations', {"locations": locations});

		});

		io.to('the_best_room').emit('news', {hello: 'based god'});
	});



}

var exports;
exports.test = test;
exports.initializeSockets = initializeSockets;