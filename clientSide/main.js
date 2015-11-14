var socket;
var c;
var ctx;
var player
var keys = []
var locations = []
var room = ""
var speed = 5;
function connect(){
	roomName = document.getElementById("roomName").value;
	playerName = document.getElementById("playerName").value;
	
	if(roomName != ""){
		
		room = roomName
		document.getElementById("canvasHolder").innerHTML =
		 '<canvas id="myCanvas" width="600" height="600" style="border:1px solid #ababab;float:left;"></canvas>' + 
		 '<div id="chatContainer" style="padding-bottom:7px;display: inline-block;height:600px;width:400px;border:1px solid #ababab;">' + 
		 '<div style="overflow-y:scroll;height:570px;" id="chat"></div><br><form action="javascript:sendMessage()"><input type="text" style="width:80%;" id="chatTextBox"><input style="width:20%;"type="submit"></form></div>';
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

		socket.on('receivedMessage', receivedMessage)

		
	}

	

}
var stars = undefined;
function main(){
	document.onkeydown = keyDown;
	document.onkeyup = keyUp
	stars = new Image();
	stars.src = 'stars.gif';

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
	var img = document.getElementById("scream");
    ctx.drawImage(stars, player.screenCenter.x/5, player.screenCenter.y/5, 600/5, 600/5,0,0,600,600);//the divided by's needs be the same or parallax stuff

    if(player.screenCenter.x - player.position.x > 100 ){
    	
    	player.screenCenter.x -= speed
    }
    else if(player.screenCenter.x - player.position.x < -100 ){
    	
    	player.screenCenter.x += speed
    }
    if(player.screenCenter.y - player.position.y > 100 ){
    	
    	player.screenCenter.y-= speed
    }
    else if(player.screenCenter.y - player.position.y < -100 ){
    	player.screenCenter.y += speed
    }

	ctx.fillStyle = "#" + player.id;
	ctx.beginPath();
	ctx.arc(300-(player.screenCenter.x-player.position.x),300-(player.screenCenter.y-player.position.y),40,0,2*Math.PI);
	ctx.fill();

	for(var i = 0; i< locations.length; i++){
		if(locations[i].id != player.id){

			ctx.fillStyle = "#" +locations[i].id
			ctx.beginPath();
			ctx.arc(locations[i].x-player.screenCenter.x+300,locations[i].y-player.screenCenter.y+300,40,0,2*Math.PI);
			ctx.fill();
		}
		
	}

	setTimeout(step, 10)
}

function physics(){
	if(document.activeElement == document.body){

		if(keys.indexOf(87) != -1){
			player.position.y-=speed;
		}
		if(keys.indexOf(83) != -1){
			player.position.y+=speed;
		}
		if(keys.indexOf(65) != -1){
			player.position.x-=speed;
		}
		if(keys.indexOf(68) != -1){
			player.position.x+=speed;
		}
		reportPosition()
	}
	
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
	player.screenCenter = {}
	player.screenCenter.x = player.position.x
	player.screenCenter.y = player.position.y

}
function sendMessage(){
	var message = document.getElementById("chatTextBox").value;
	socket.emit('sendMessage', {"message":message,"roomName":room,"ign":player.ign,"id":player.id})
	document.getElementById("chatTextBox").value = "";
}
function receivedMessage(data){
	document.getElementById("chat").innerHTML+= '<u style="color:#' + data.id + '">' + data.ign + '</u>' + ' : ' + data.message + '</br>';
	var objDiv = document.getElementById("chat");
	objDiv.scrollTop = objDiv.scrollHeight;
}






