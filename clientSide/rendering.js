/*
List of variables available after initialize render file is called probs
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
var mouseCoords = [gameDimmensions[0]/2,gameDimmensions[1]/2]
var blockPlacementMode = true;
var stars = undefined;
var animationState
var spriteSheet

*/
function render(){
	drawBackground();
	
    if(blockPlacementMode){
    	drawTileSpotlight();
    }

    adjustScreenCenter();
    
    
    //drawPlayer();
    drawSprite();
	
	drawTiles();

	
	drawOtherPlayers();
	//draw others
	
}


function initializeRenderFile(canvas, context, background){

}

function drawBackground(){
	ctx.fillStyle = "#FBFBFB";
	ctx.fillRect(0,0,1000,1000);
	
    ctx.drawImage(stars, player.screenCenter.x/5-blockSize/2, player.screenCenter.y/5-blockSize/2, gameDimmensions[0]/5, gameDimmensions[1]/5,0,0,gameDimmensions[0],gameDimmensions[1]);//the divided by's needs be the same or parallax stuff

}

function drawTiles(){
	if(tileData.length != 0){
		for(var j = 0; j<tileData.length; j++){
			ctx.fillStyle = "#" + tileData[j].id.toString();
			ctx.fillRect(gameDimmensions[0]/2-(player.screenCenter.x-blockSize*tileData[j].x)-blockSize/2,gameDimmensions[1]/2-(player.screenCenter.y-blockSize*tileData[j].y)-blockSize/2,blockSize,blockSize);
		}
	}
}
function drawPlayer(){
	ctx.fillStyle = "#" + player.id;
	ctx.beginPath();
	ctx.arc(gameDimmensions[0]/2-(player.screenCenter.x-player.position.x),gameDimmensions[1]/2-(player.screenCenter.y-player.position.y),playerRadius,0,2*Math.PI);
	ctx.fill();

	ctx.fillStyle = "#000000";
	ctx.beginPath();
	ctx.moveTo(gameDimmensions[0]/2-(player.screenCenter.x-player.position.x),gameDimmensions[1]/2-(player.screenCenter.y-player.position.y));
	ctx.lineTo(gameDimmensions[0]/2-(player.screenCenter.x-player.position.x)+playerRadius*Math.cos(player.rotation),gameDimmensions[1]/2-(player.screenCenter.y-player.position.y)-playerRadius*Math.sin(player.rotation));
	ctx.stroke();
}


function drawSprite(){
	var swidth = 25;
	var sheight = 35;


	if(moving){
		if(animationState >=40){animationState = 0;}
		var column = 0;
		var row = 0;
		var rot = player.rotation*180/Math.PI
		col = 3-Math.floor(animationState/10)
		if(rot == 0){
			row = 2	
		}
		else if(rot == 45 || rot == 90 || rot == 135){
			row = 3
		}
		else if(rot == 180){
			row = 1
		}
		else{
			row = 0
		}
		var sx = 13 + 51*col
		var sy = 8 + 51*row

		ctx.drawImage(spriteSheet, sx,sy,swidth,sheight,gameDimmensions[0]/2-(player.screenCenter.x-player.position.x)-playerRadius,gameDimmensions[1]/2-(player.screenCenter.y-player.position.y) - playerRadius,80,80);
		animationState++;
	}
	else{

		var row = 0;
		var rot = player.rotation*180/Math.PI
		col = 0
		if(rot == 0){
			row = 2	
		}
		else if(rot == 45 || rot == 90 || rot == 135){
			row = 3
		}
		else if(rot == 180){
			row = 1
		}
		else{
			row = 0
		}
		var sx = 13 + 51*col
		var sy = 8 + 51*row
		animationState = 0;
		ctx.drawImage(spriteSheet, sx,sy,swidth,sheight,gameDimmensions[0]/2-(player.screenCenter.x-player.position.x)-playerRadius,gameDimmensions[1]/2-(player.screenCenter.y-player.position.y) - playerRadius,80,80);

	}
	


}


function drawOtherPlayers(){
	for(var i = 0; i< locations.length; i++){
		if(locations[i].id != player.id){

			ctx.fillStyle = "#" +locations[i].id
			ctx.beginPath();
			ctx.arc(locations[i].x-player.screenCenter.x+gameDimmensions[0]/2,locations[i].y-player.screenCenter.y+gameDimmensions[1]/2,playerRadius,0,2*Math.PI);
			ctx.fill();
		}
		
	}
}

function adjustScreenCenter(){
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
}

function drawTileSpotlight(){
	ctx.save();
    	ctx.fillStyle = "#ADD8E6"
		ctx.globalAlpha = 0.4;
		ctx.beginPath();
		ctx.arc(gameDimmensions[0]/2-(player.screenCenter.x-player.position.x),gameDimmensions[1]/2-(player.screenCenter.y-player.position.y),300,0,2*Math.PI);
		ctx.fill();
		ctx.clip();
		var beginXPos = (Math.floor(player.screenCenter.x/blockSize)-10)*blockSize;
		var beginYPos = (Math.floor(player.screenCenter.y/blockSize)-10)*blockSize;
		var finalXPos = beginXPos + 20 * blockSize;
		var finalYPos = beginYPos + 20 * blockSize;

		for(var i = 0; i<20; i++){
			ctx.beginPath();
			ctx.moveTo((beginXPos+i*blockSize)-player.screenCenter.x-blockSize/2,beginYPos-player.screenCenter.y-blockSize/2);
			ctx.lineTo((beginXPos+i*blockSize)-player.screenCenter.x-blockSize/2,finalYPos-player.screenCenter.y-blockSize/2);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo((beginXPos+i*blockSize)-player.screenCenter.x-blockSize/2+1,beginYPos-player.screenCenter.y-blockSize/2);
			ctx.lineTo((beginXPos+i*blockSize)-player.screenCenter.x-blockSize/2+1,finalYPos-player.screenCenter.y-blockSize/2);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(beginXPos-player.screenCenter.x-blockSize/2,(beginYPos+i*blockSize)-player.screenCenter.y-blockSize/2);
			ctx.lineTo(finalXPos-player.screenCenter.x-blockSize/2,(beginYPos+i*blockSize)-player.screenCenter.y-blockSize/2);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(beginXPos-player.screenCenter.x-blockSize/2,(beginYPos+i*blockSize)-player.screenCenter.y-blockSize/2+1);
			ctx.lineTo(finalXPos-player.screenCenter.x-blockSize/2,(beginYPos+i*blockSize)-player.screenCenter.y-blockSize/2+1);
			ctx.stroke();


		}
		//var cursorXPos =  Math.floor((mouseCoords.x+blockSize/2)/blockSize)*blockSize
		//var cursorYPos =  (Math.floor((mouseCoords.y+blockSize/2)/blockSize)*blockSize)
		//(player.screenCenter.x-blockSize*tileData[j].x)-blockSize/2
		var cursorXPos =  player.screenCenter.x + ( mouseCoords.x-gameDimmensions[0]/2) + blockSize/2
		var cursorYPos =  player.screenCenter.y + ( mouseCoords.y-gameDimmensions[1]/2) + blockSize/2
		var cursorBlockX = Math.floor(cursorXPos/blockSize)
		var cursorBlockY = Math.floor(cursorYPos/blockSize)
		var cursorScreenX = gameDimmensions[0]/2-(player.screenCenter.x-blockSize*cursorBlockX)-blockSize/2
		var cursorScreenY = gameDimmensions[1]/2-(player.screenCenter.y-blockSize*cursorBlockY)-blockSize/2
		ctx.fillRect(cursorScreenX,cursorScreenY,blockSize,blockSize);

		activeBlock = {"x":cursorBlockX, "y":cursorBlockY}

		//ctx.fillRect(cursorXPos,cursorYPos,blockSize,blockSize)



		ctx.restore();
}
function mapCoordToCanvasCoord(coord, playerReference){//todo, change to this get some standard way to do that
	return coord - playerReference - blockSize/2;
}






