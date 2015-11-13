var socket;
var c;
var ctx;
var player
var keys = []
var locations = []
var room = ""
function connect(){
	roomName = document.getElementById("roomName").value;
	playerName = document.getElementById("playerName").value;
	
	if(roomName != ""){
		
		room = roomName
		document.getElementById("canvasHolder").innerHTML = '<canvas id="myCanvas" width="600" height="600" style="border:1px solid #000000;"></canvas>';
		createPlayer(playerName)
		
		socket = io();
		socket.on('requestNames', function (data){
			socket.emit('returnNames', {"playerName":player.ign,"id":player.id,"roomName":roomName})
			
		});
		socket.on('roomConnection', function(data){
			main();
			console.log("here we go")
		});

		socket.on('locations', function (data) {
			locations = data.locations

		});



		
	}

	

}

function main(){
	document.onkeydown = keyDown;
	document.onkeyup = keyUp
	

	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");
	ctx.fillStyle = "#6AACAC";
	ctx.fillRect(0,0,1000,1000);

	

	ctx.beginPath();
	ctx.arc(player.position.x,player.position.y,40,0,2*Math.PI);
	ctx.stroke();

	console.log("hey there!")
	
	step()

}

function step(){
	physics()
	//this is where we will send our state to the server
	ctx.fillStyle = "#FBFBFB";
	ctx.fillRect(0,0,1000,1000);
	ctx.fillStyle = "#" + player.id;
	ctx.beginPath();
	ctx.arc(player.position.x,player.position.y,40,0,2*Math.PI);
	ctx.fill();

	for(var i = 0; i< locations.length; i++){
		if(locations[i].id != player.id){
			ctx.fillStyle = "#" +locations[i].id
			ctx.beginPath();
			ctx.arc(locations[i].x,locations[i].y,40,0,2*Math.PI);
			ctx.fill();
		}
		
	}

	setTimeout(step, 10)
}

function physics(){
	if(keys.indexOf(87) != -1){
		player.position.y-=5;
	}
	if(keys.indexOf(83) != -1){
		player.position.y+=5;
	}
	if(keys.indexOf(65) != -1){
		player.position.x-=5;
	}
	if(keys.indexOf(68) != -1){
		player.position.x+=5;
	}
	
	reportPosition()
}

function reportPosition(){
	socket.emit('myLocation', {"roomName": room, "x":player.position.x, "y":player.position.y, "id":player.id});
	

}

function keyDown(e){
	value = e.keyCode
	if(keys.indexOf(value) == -1){
		keys.push(value)
	}
}
function keyUp(e){
	value = e.keyCode

	for(var i = keys.length; i--;) {
		if(keys[i] === value) {
			keys.splice(i, 1);
		}
	} 
  
}
function makeId()
{
    var text = "";
    var possible = "ABCDE0123456789";//no f becayse i dont want any tots white

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function createPlayer(name){
	player = {};
	player.position = {};
	player.position.x = 300;
	player.position.y = 300;
	player.id = makeId()
	player.ign = name

}





