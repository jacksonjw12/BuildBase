var io
//var locations = {    {"room1":[ {"name":"AAAABB","x":100,"y":100}, {"name":"BABCDC","x":200,"y":100}]}    }

//playerexample = {"Socket":socket, "Location":{"x":42,"y",24}, "Rotation":90, "IGN":"Richard Wang", GameRoom:bestgame}
//gameroom example = {"name":abcd, }
var worldExample = {
	"name":"room1",
	"players":[
	{
		"id":"AAAABB",
		"socket":123,
		"ign":"jill"
	},
	{
		"id":"BABDC",
		"socket":123,
		"ign":"jill"
	}

	],
	"tileData":[[0,1,1,0],[1,0,0,1],[1,0,0,1],[0,1,1,0]],

	"playerData":[]

}



var connectedPlayers = [
	{
		"name":"jack",
		"room":"room1"

	}
]
var worlds = [{
	"name":"room1",
	"players":[
	{
		"id":"AAAABB",
		"socket":123,
		"ign":"jill"
	},
	{
		"id":"BABDC",
		"socket":123,
		"ign":"jill"
	}

	],
	"tileData":[[0,1,1,0],[1,0,0,1],[1,0,0,1],[0,1,1,0]],

	"playerData":[ {"id":"AAAABB","x":100,"y":100}, {"id":"BABCDC","x":200,"y":100}]

}];



var connectedPlayers = [
	{
		"name":"jack",
		"room":"room1"

	}


]


function test(req, res){
	console.log("eyy lmao")
	res.send("hey");
}

function initializeSockets(server){
	io = require('socket.io')(server);
	io.on('connection', function (socket) {
		
			
		socket.emit('requestNames', {});
			
		socket.on('returnNames', function (data){
			socket.join(data.roomName)
			newRoom = true;
			for(worldIterator in worlds){
				world = worlds[worldIterator]
				if(world.name == data.roomName){
					world.players.push({"id":data.id, "socket":socket, "ign":data.playerName})
					newRoom = false;

				}
			}
			if(newRoom){
				worldExample.name = data.roomName
				worldExample.players = [{"id":data.id, "socket":socket, "ign":data.playerName}]
				worldExample.playerData = []
				worlds.push(worldExample)
				console.log("new room")
			}
			socket.emit('roomConnection', {})
			
		});

		socket.on('myLocation', function (data) {
			//data = {roomName, id, x,y}

			for(worldIterator in worlds){
				world = worlds[worldIterator]

				if(world.name == data.roomName){
					var newPlayer = true
					for(playerIterator in world.playerData){
						player = world.playerData[playerIterator]
						if(player.id == data.id){


							newPlayer = false
							player.x = data.x
							player.y = data.y
						}
					}
					if(newPlayer){
						console.log("new Player")
						if(world.playerData)
						world.playerData.push({"id":data.id,"x":data.x,"y":data.y})
						console.log("added a new player : " + data.id)
						
						console.log("hi dude")
						console.log(world)

					}
					io.to(data.roomName).emit('locations',{"locations":world.playerData})
					

					
				}
				
			}

		});

		io.to('the_best_room').emit('news', {hello: 'based god'});
	});



}

var exports;
exports.test = test;
exports.initializeSockets = initializeSockets;