var Hand = require("./hand");
var Deck = require("./deck");

var Table = function(){
	this.players = [];
	this.deck = new Deck();
};
Table.prototype = {
	addPlayer : function (player){
		this.players.push(player);
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

	wait : function(){
	},

	_canPlay : function() { return this.players.length > 1;	}
};

module.exports = Table;