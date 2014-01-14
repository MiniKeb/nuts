var net = require("net");
var JsonSocket = require("json-socket");
var Table = require("../nuts-api/src/table.js");
var Player = require("../nuts-api/src/player.js");

var port = 4242;
var server = net.createServer();
var table = new Table();
server.listen(port);

server.on("connection", function(socket){
	var ip = socket.remoteAddress;
	socket = new JsonSocket(socket);
	socket.on('message', function(message) {
		switch(message.command){
			case "NewPlayer":
				table.addPlayer(new Player(message.name));
				socket.sendMessage({content : "New player "+ message.name + " created."});
				break;
		}
	});

	socket.on("close", function(arg){
		console.log(arg);
		console.log("Bye");
	});
});