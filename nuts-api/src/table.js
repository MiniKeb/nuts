var extend = require("node.extend");
var EventEmitter = require("events").EventEmitter;
var Hand = require("./hand");
var Deck = require("./deck");

var Table = function(smallBlind){
	this.tablePlayers = [];
	this.players = [];
	this.deck = new Deck();
	this.currentBlindIndex = 0;
	this.currentSmallBlind = smallBlind;
	this.currentPlayerIndex = 0;
};
Table.prototype = extend({}, EventEmitter.prototype, {
	addPlayer : function (player){
		this.tablePlayers.push(player);
		this.players.push(player);
		var self = this;
		
		player.on("Bet", function(amount){
			self.emit("PlayerBet", { player : this, amount : amount });
		});
		player.on("Folded", function(player){
			self.emit("PlayerFolded", this);
		});
		
		this.emit("PlayerAdded", player);
	},

	removePlayer : function(player){
		var playerIndex = this.players.indexOf(player);
		if (playerIndex > -1){
			this.players.splice(playerIndex, 1);
		}
		this.emit("PlayerRemoved", player);
	},

	distribute : function(){
		if(this._canPlay()){
			for(var i = 0; i < this.players.length; i++){
				var first = this.deck.peekCard();
				var second = this.deck.peekCard();
				var hand = new Hand(first, second);
				this.players[i].addHand(hand);
			}
		}
	},

	preflop: function(){
		var currentIndex = this.currentBlindIndex;
		var nextIndex = this._getNextIndex(this.currentBlindIndex);
		
		this.players[currentIndex].bet(this.currentSmallBlind);
		this.players[nextIndex].bet(this.currentSmallBlind * 2);

		this.currentBlindIndex = this._getNextIndex(this.currentBlindIndex);
		this.currentPlayerIndex = this._getNextIndex(this.currentBlindIndex);
	},

	waitCurrentPlayer: function(){
		var waitedPlayer = this.players[this.currentPlayerIndex];
		this.emit("PlayerWaited", waitedPlayer);

		this.currentPlayerIndex = this._getNextIndex(this.currentPlayerIndex);
	},

	_getNextIndex: function(index){
		return (index + 1 >= this.players.length) ? 0 : index + 1;
	},

	_canPlay : function() { return this.players.length > 1;	}
});

module.exports = Table;