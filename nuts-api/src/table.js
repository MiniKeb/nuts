var extend = require("node.extend");
var EventEmitter = require("events").EventEmitter;
var Hand = require("./hand");
var Deck = require("./deck");

var Table = function(smallBlind){
	this.players = [];
	this.deck = new Deck();
	this.currentBlindIndex = 0;
	this.currentSmallBlind = smallBlind;
};
Table.prototype = extend({}, EventEmitter.prototype, {
	addPlayer : function (player){
		this.players.push(player);
		this.emit("PlayerAdded", player);
	},

	removePlayer : function(player){
		var playerIndex = this.players.indexOf(player);
		if (playerIndex > -1){
			this.players.splice(playerIndex, 1);
		}
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
		var nextIndex = this.currentBlindIndex + 1;
		nextIndex = nextIndex >= this.players.length ? 0 : nextIndex;
		
		this.players[currentIndex].bet(this.currentSmallBlind);
		this.players[nextIndex].bet(this.currentSmallBlind * 2);

		this.currentBlindIndex++;
		if(this.currentBlindIndex >= this.players.length)
			this.currentBlindIndex = 0;
	},

	wait : function(){
		
	},

	_canPlay : function() { return this.players.length > 1;	}
});

module.exports = Table;