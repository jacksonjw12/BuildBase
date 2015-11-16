var socket;
var c;
var ctx;
var player
var keys = []
var locations = []
var room = ""
var timestep = 20;
var speed = 5*timestep/10;
var gameDimmensions = [600,600]
var chatDimmensions = [400,600]
var tileData = []
var playerRadius = 40;
var blockSize = 100;
function connect(){
	roomName = document.getElementById("roomName").value;
	playerName = document.getElementById("playerName").value;
	
	if(roomName != ""){
		
		room = roomName
		document.getElementById("canvasHolder").innerHTML =
		 '<canvas id="myCanvas" width="' + gameDimmensions[0] + 'px" height="' + gameDimmensions[1] +'px" style="border:1px solid #ababab;float:left;"></canvas>' + 
		 '<div id="chatContainer" style="padding-bottom:7px;display: inline-block;height:' + chatDimmensions[1] + 'px;width:'+chatDimmensions[0]+'px;border:1px solid #ababab;">' + 
		 '<div style="overflow-y:scroll;height:'+(chatDimmensions[1]-30)+'px;" id="chat"></div><br><form action="javascript:sendMessage()"><input type="text" style="width:80%;" id="chatTextBox"><input style="width:20%;"type="submit"></form></div>';
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
		socket.on('newTileData', receiveTileData)
		
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
	ctx.fillRect(0,0,gameDimmensions[0],gameDimmensions[1]);

	

	ctx.beginPath();
	ctx.arc(player.position.x,player.position.y,playerRadius,0,2*Math.PI);
	ctx.stroke();

	console.log("hey there!")
	
	step()

}

function step(){
	physics()
	//this^ is where we will send our state to the server
	render()
	

	setTimeout(step, timestep)
}
function render(){
	ctx.fillStyle = "#FBFBFB";
	ctx.fillRect(0,0,1000,1000);
	var img = document.getElementById("scream");
    ctx.drawImage(stars, player.screenCenter.x/5, player.screenCenter.y/5, gameDimmensions[0]/5, gameDimmensions[1]/5,0,0,gameDimmensions[0],gameDimmensions[1]);//the divided by's needs be the same or parallax stuff

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
    //plr---
	ctx.fillStyle = "#" + player.id;
	ctx.beginPath();
	ctx.arc(gameDimmensions[0]/2-(player.screenCenter.x-player.position.x),gameDimmensions[1]/2-(player.screenCenter.y-player.position.y),playerRadius,0,2*Math.PI);
	ctx.fill();

	ctx.fillStyle = "#000000";
	ctx.beginPath();
	ctx.moveTo(gameDimmensions[0]/2-(player.screenCenter.x-player.position.x),gameDimmensions[1]/2-(player.screenCenter.y-player.position.y));
	ctx.lineTo(gameDimmensions[0]/2-(player.screenCenter.x-player.position.x)+playerRadius*Math.cos(player.rotation),gameDimmensions[1]/2-(player.screenCenter.y-player.position.y)-playerRadius*Math.sin(player.rotation));
	ctx.stroke();
	//\plr--

	if(tileData.length != 0){
		for(var j = 0; j<tileData.length; j++){
			ctx.fillStyle = "#" + tileData[j].id.toString();
			ctx.fillRect(gameDimmensions[0]/2-(player.screenCenter.x-blockSize*tileData[j].x)-blockSize/2,gameDimmensions[1]/2-(player.screenCenter.y-blockSize*tileData[j].y)-blockSize/2,blockSize,blockSize);
		}
	}

	//draw others
	for(var i = 0; i< locations.length; i++){
		if(locations[i].id != player.id){

			ctx.fillStyle = "#" +locations[i].id
			ctx.beginPath();
			ctx.arc(locations[i].x-player.screenCenter.x+gameDimmensions[0]/2,locations[i].y-player.screenCenter.y+gameDimmensions[1]/2,playerRadius,0,2*Math.PI);
			ctx.fill();
		}
		
	}
}
function physics(){
	if(document.activeElement == document.body){
		var xDelta = 0;
		var yDelta = 0;
		var prevX = player.position.x
		var prevY = player.position.y
		if(keys.indexOf(87) != -1){
			player.position.y-=speed;
			yDelta++;
		}
		if(keys.indexOf(83) != -1){
			player.position.y+=speed;
			yDelta--;
		}
		if(keys.indexOf(65) != -1){
			player.position.x-=speed;
			xDelta--;

		}
		if(keys.indexOf(68) != -1){
			player.position.x+=speed;
			xDelta++;

		}
		if(keys.indexOf(66) != -1){
			createTile(101099)
		}
		if(xDelta != 0 || yDelta != 0){
			var angle = 0;
			if(xDelta > 0){
				angle = Math.atan(yDelta/xDelta)
			}
			else if(xDelta<0 && yDelta>=0){
				angle = Math.PI + Math.atan(yDelta/xDelta)
			}
			else if(xDelta<0 && yDelta<0){
				angle = -Math.PI + Math.atan(yDelta/xDelta)
			}
			else if(yDelta>0 && xDelta==0){
				angle = Math.PI/2
			}
			else if(yDelta<0 && xDelta==0){
				angle = -Math.PI/2
			}
			if(angle < 0){
				angle+=Math.PI*2
			}

			player.rotation = angle
		}

		//collision time :) todo, make sure a player cant put a block ontop of a player, or that once they do, that player is either immune or gets booted out of the way
		//player.position.x player.position.y
		for(var i = 0; i<tileData.length; i++){
			var tile = tileData[i]
			tileSize = blockSize
			var tileX = tile.x*tileSize
			var tileY = tile.y*tileSize
			var distance = playerRadius+tileSize/2
			if(Math.abs(tileX-player.position.x) < distance && Math.abs(tileY-player.position.y) < distance){
				if(xDelta != 0 && Math.abs(tileX-player.position.x) < distance && Math.abs(tileY-prevY) < distance){
					if(xDelta > 0){
						player.position.x = tileX-distance-1
						
					}
					else{
						player.position.x = tileX+distance+1
						
					}
				}


				if(yDelta != 0 && Math.abs(tileX-prevX) < distance && Math.abs(tileY-player.position.y) < distance){
					if(yDelta > 0){
						player.position.y = tileY+distance+1
					}
					else{
						player.position.y = tileY-distance-1
					}
				}
				

			}
			
			
			

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
	player.position.x = gameDimmensions[0]/2;
	player.position.y = gameDimmensions[1]/2;
	player.id = makeId()
	player.ign = name
	player.screenCenter = {}
	player.screenCenter.x = player.position.x
	player.screenCenter.y = player.position.y
	player.rotation = 0;

}
function sendMessage(){
	var message = document.getElementById("chatTextBox").value;
	socket.emit('sendMessage', {"message":message,"roomName":room,"ign":player.ign,"id":player.id})
	document.getElementById("chatTextBox").value = "";
}	

function createTile(blockID){
	//rn physics will call this
	var blockWiseX = Math.floor((player.position.x+tileSize/2)/tileSize)
	var blockWiseY = Math.floor((player.position.y+tileSize/2)/tileSize)
	var blockWiseXLeft = Math.floor((player.position.x-playerRadius)/tileSize);
	var blockWiseYUp = Math.floor((player.position.y-playerRadius)/tileSize);
	var blockWiseXRight = Math.floor((player.position.x+tileSize/2+playerRadius)/tileSize);
	var blockWiseYDown = Math.floor((player.position.y+tileSize/2+playerRadius)/tileSize);
	console.log(player.rotation)
	var rot = player.rotation/Math.PI*180
	if(rot == 0){
		
		blockWiseX = blockWiseXRight
	}
	else if(rot == 45){
		blockWiseX = blockWiseXRight
		blockWiseX = blockWiseXDown
	}
	else if(rot == 90){
		blockWiseY = blockWiseYUp
	}
	else if(rot == 135){
		blockWiseX = blockWiseXLeft
		blockWiseY = blockWiseYUp
	}
	else if(rot == 180){
		blockWiseX = blockWiseXLeft
		
	}
	else if(rot == 235){
		blockWiseX = blockWiseXLeft
		blockWiseY = blockWiseYDown
	}
	else if(rot == 270){
		
		blockWiseY = blockWiseYDown
	}
	else if(rot == 315){
		blockWiseX = blockWiseXRight
		blockWiseY = blockWiseYDown
	}
	
	socket.emit('addedTile', {"tile":{"id":blockID,"x":blockWiseX,"y":blockWiseY,"z":0},"roomName":room})



}

function receivedMessage(data){
	document.getElementById("chat").innerHTML+= '<u style="color:#' + data.id + '">' + data.ign + '</u>' + ' : ' + data.message + '</br>';
	var objDiv = document.getElementById("chat");
	objDiv.scrollTop = objDiv.scrollHeight;
}
function receiveTileData(data){
	if(data.numberOf == "multiple"){//i think the only reason multiple would be listed is for new players, so we will assums that nothins in plr array and just overwrite
		tileData = data.tiles;
		console.log("received some tiles")
	}
	else{
		var newTile = true;
		for(var i = 0; i<tileData.length; i++){
			if(data.tile.x == tileData[i].x && data.tile.y == tileData[i].y && data.tile.z == tileData[i].z){
				tileData[i].id = data.tile.id;
				newTile = false;
			}
		}
		if(newTile){
			tileData.push(data.tile)
		}
	}
	
}





