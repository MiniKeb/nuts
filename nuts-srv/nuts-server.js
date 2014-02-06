var net = require("net");
var JsonSocket = require("json-socket");
var _ = require("underscore")._;
var Table = require("../nuts-api/src/table.js");
var Player = require("../nuts-api/src/player.js");
var CardParser = require("../nuts-api/src/card_parser.js");

var PokerServer = function(){
	this.table = new Table(2);
	this.parser = new CardParser("Vcn");

	this.playerSockets = {};
};
PokerServer.prototype = {
	addPlayer : function(name, socket){
		try{
			var startCash = 100;
			var player = new Player(name, startCash);
			
			var self = this;
			player.on("Folded", function(){ self.onFold(this); });
			player.on("Bet", function(){ self.onBet(this); });
			player.on("Called", function(){ self.onCall(this); });
			player.on("Checked", function(){ self.onCheck(this); });
			player.on("AllIn", function(){ self.onAllin(this); });
			player.on("TokenObtained", function(actions){ self.onTokenObtained(this, actions); });
			player.on("SmallBlind", function(amount){ self.onBlind(this, amount); });
			player.on("BigBlind", function(amount){ self.onBlind(this, amount); });
			player.on("Won", function(){ self.onWon(this); });

			this.playerSockets[name] = { player: player, socket: socket };
			this.table.addPlayer(player);

			this._sendTo(player, "Welcome "+ name +" (Cash: "+ startCash +").");
		}catch(error){
			console.log(error);
		}
	},

	getPlayerByName: function(name){
		return this.playerSockets[name].player;
	},

	onFold: function(player){
		this._broadcast(player.name +" : Fold.");
	},
	onBet: function(player){
		this._broadcast(player.name +" : Bet ("+ player.betAmount +"$).");
	},
	onCall: function(player){
		this._broadcast(player.name +" : Call ("+ player.betAmount +"$).");
	},
	onCheck: function(player){
		this._broadcast(player.name +" : Check.");
	},
	onAllin: function(player){
		this._broadcast(player.name +" : ALL IN !");
	},
	onTokenObtained: function(player, event){
		var message = "Cash: "+ player.stackAmount
			+"$. Cards: "+ this._toStringCards([player.hand.firstCard, player.hand.secondCard])
			+". Board: "+ this._toStringCards(event.board);

		this._sendTo(player, message);

		var question = "What do you want to play : ";
		for(var action in event.actions){
			question += action +" ";
		}
		question += "?";
		this._askTo(player, question);
	},
	onBlind: function(player, amount){
		this._broadcast(player.name +" paid blind ("+ amount +"$).");
	},
	onWon: function(player){
		this._broadcast(player.name +" won.");
	},

	_toStringCards: function(cards){
		var text = "[";
		for(var i = 0; i < cards.length; i++){
			text += this.parser.format(cards[i]);
			if(i+1 < cards.length){
				text += " ";
			}
		}
		text += "]";

		return text;
	},

	_broadcast: function(message){
		for(var player in this.playerSockets){
			this._sendTo(this.playerSockets[player].player, message);
		}
	},

	_askTo: function(player, question){
		this._send(player, "Ask", question);
	},

	_sendTo: function (player, message){
		this._send(player, "Display", message);
	},

	_send: function(player, action, message){
		try{
			this.playerSockets[player.name].socket.sendMessage({ action : action, content : message });
			console.log(player.name +" => "+ message);
		}catch(error){
			console.log(error);
		}
	}
};



//-------------------------------------------
var poker = new PokerServer();

var port = 4242;
var server = net.createServer();

server.listen(port);

server.on("connection", function(socket){
	var ip = socket.remoteAddress;
	socket = new JsonSocket(socket);
	socket.on('message', function(message) {
		try{
			switch(message.command){
				case "NewPlayer":
					poker.addPlayer(message.name, socket);
					break;

				case "fold":
					poker.getPlayerByName(message.name).actions.fold();
					break;

				case "bet":
					var amount = parseInt(message.amount, 10);
					poker.getPlayerByName(message.name).actions.bet(amount);
					break;

				case "call":
					poker.getPlayerByName(message.name).actions.call();
					break;

				case "check":
					poker.getPlayerByName(message.name).actions.check();
					break;
			}
		}catch(error){
			console.log(error);
		}
	});

	socket.on("close", function(arg){
		console.log("A player leaved.");
	});
});