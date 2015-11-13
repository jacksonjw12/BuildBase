
var socket
function main(){

	console.log("hey")

	socket = io();
	socket.on('news', function (data) {
		console.log(data);
		socket.emit('my other event', { my: 'data' });
		document.getElementById("textbox").innerHTML = JSON.stringify(data);
	});

}






main();