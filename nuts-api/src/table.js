var extend = require("node.extend");
var EventEmitter = require("events").EventEmitter;
var Hand = require("./hand");
var Deck = require("./deck");
var Game = require("./game");

var Table = function(smallBlind){
	this.minPlayerCount = 2;

	this.players = [];
	this.deck = new Deck();
	this.gameCount = 0;
};
Table.prototype = extend({}, EventEmitter.prototype, {
	addPlayer : function (player){
		this.players.push(player);
		if(this.players.length == this.minPlayerCount){
			this._startGame();
		}
	},

	removePlayer : function(player){
		var playerIndex = this.players.indexOf(player);
		if (playerIndex > -1){
			this.players.splice(playerIndex, 1);
		}
	},

	_startGame: function(){
		var self = this;
		this.emit("Started");
		this.game = new Game(this.players, this.gameCount);
		this.game.on("Finished", function(){ self._startGame(); });
		this.game.start();
		this.gameCount++;
	}
	distribute : function(){
		if(this._canPlay()){
			for(var i = 0; i < this.players.length; i++){
				var first = this.deck.peekCard();				
				var second = this.deck.peekCard();
				var hand = [first, second];
				this.players[i].addHand(hand);
			}
		}
	},

	wait : function(){
		
	},

	_canPlay : function() { return this.players.length > 1;	}
});

module.exports = Table;