var extend = require("node.extend");
var EventEmitter = require("events").EventEmitter;
var Hand = require("./hand");
var Deck = require("./deck");
var Game = require("./game");

var Table = function(smallBlind, minPlayerCount){
	this.minPlayerCount = minPlayerCount > 2 ? minPlayerCount : 2;

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
});

module.exports = Table;