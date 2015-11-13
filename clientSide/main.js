var socket;
var c;
var ctx;
var player
var keys = []
var locations = []
function main(){
	document.onkeydown = keyDown;
	document.onkeyup = keyUp
	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");
	ctx.fillStyle = "#6AACAC";
	ctx.fillRect(0,0,1000,1000);

	createPlayer()

	ctx.beginPath();
	ctx.arc(player.position.x,player.position.y,40,0,2*Math.PI);
	ctx.stroke();

	console.log("hey there!")

	socket = io();
	socket.on('nothing', function (data) {
		console.log(data);
		socket.emit('my other event', { my: 'data' });
	});

	socket.on('locations', function (data) {
		
		locdata = data.locations
		

		locations = locdata

	});


	render()

}

function render(){
	physics()
	//this is where we will send our state to the server
	ctx.fillStyle = "#FBFBFB";
	ctx.fillRect(0,0,1000,1000);
	ctx.fillStyle = "#" + player.name;
	ctx.beginPath();
	ctx.arc(player.position.x,player.position.y,40,0,2*Math.PI);
	ctx.fill();

	for(var i = 0; i< locations.length; i++){
		if(locations[i].name != player.name){
			ctx.fillStyle = "#" +locations[i].name
			ctx.beginPath();
			ctx.arc(locations[i].x,locations[i].y,40,0,2*Math.PI);
			ctx.fill();
		}
		
	}

	setTimeout(render, 10)
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
	socket.emit('myLocation', {"name": player.name, "x":player.position.x, "y":player.position.y});

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
function makeName()
{
    var text = "";
    var possible = "ABCDE0123456789";//no f becayse i dont want any tots white

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function createPlayer(){
	player = {};
	player.position = {};
	player.position.x = 300;
	player.position.y = 300;
	player.name = makeName()

}





main();