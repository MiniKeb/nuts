var net = require('net');
var JsonSocket = require('json-socket');
var Readline = require('readline');


var socket = new JsonSocket(new net.Socket());
var port = 4242;
var host = '127.0.0.1';

var rl = Readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.on('SIGINT', function(arg){
	console.log(arg);
	console.log("Bye");
	socket.end();
	rl.close();
});

rl.question("Server IP : ", function(ipAddress){
	host = ipAddress ? ipAddress : host;
	rl.question("Name : ", function(name){
		player = name ? name : "Name";
		socket.connect(port, host);
		socket.on('connect', function() {
			socket.sendMessage({command : "NewPlayer", name : player});
		});
		socket.on("message", function(message){
			console.log(message);
		});
	});
});


messages = [
	{
		command : "NewPlayer",
		name : "Bill"
	},

	{
		command : "Check"
	},

	{
		command : "Bet"
	},

	{
		command : "Check"
	},

	{
		command : "Check"
	}
];
