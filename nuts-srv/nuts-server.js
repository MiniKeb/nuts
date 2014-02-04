var net = require("net");
var JsonSocket = require("json-socket");
var Table = require("../nuts-api/src/table.js");
var Player = require("../nuts-api/src/player.js");
var CardParser = require("../nuts-api/src/card_parser.js");


var port = 4242;
var server = net.createServer();

var table = new Table(1);
var parser = new CardParser("Vcn");

var playerSockets = {};
server.listen(port);

table.on("PlayerAdded", function(player){
	console.log("New player "+ player.name + " created.");
	sendTo(player, "Welcome "+ player.name);
});

table.on("PlayerBet", function(bet){
	globalSend(bet.player.name + " bet " + bet.amount);
});

table.on("PlayerWaited", function(player){
	askTo(player, "What do you wanna play? (Fold/Bet/Raise/Check)");
});

function send(player, action, message){
	try{
		playerSockets[player.name].sendMessage({ action : action, content : message });
		console.log(player.name +" => "+ message);
	}catch(error){
		console.log(error);
	}
}

function askTo(player, question){
	send(player, "Ask", question);
}

function sendTo(player, message){
	send(player, "Display", message);
}

function globalSend(message){
	for(var player in playerSockets){
		sendTo(player, message);
	}
}

server.on("connection", function(socket){
	var ip = socket.remoteAddress;
	socket = new JsonSocket(socket);
	socket.on('message', function(message) {
		switch(message.command){
			case "NewPlayer":
				var player = new Player(message.name);
				
				playerSockets[message.name] = socket;

				table.addPlayer(player);

				console.log(table.players.length);
				if(table.players.length > 1){
					console.log("distribution");
					table.distribute();

					for(var i = 0; i < table.players.length; i++){
						var current = table.players[i];
						var cards = parser.format(current.hand.firstCard) + " " + parser.format(current.hand.secondCard);
						sendTo(current, "Your cards : "+ cards);
					}

					table.preflop();
					table.waitCurrentPlayer();
				}
				break;

			case "Fold":
				break;

			case "Bet":
				break;

			case "Check":
				break;
		}
	});

	socket.on("close", function(arg){
		console.log(arg);
		console.log("Bye");
	});
});