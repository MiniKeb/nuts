var Hand = require("./hand");
var Deck = require("./deck");

var Table = function(){
	this.players = [];
	this.deck = new Deck();
	this.canStart = false;
};
Table.prototype = {
	addPlayer : function (player){
		this.players.push(player);
		if (this.players.length > 1){
			this.canStart = true;
		}
	},

	distribute : function(){
		if(this.canStart){
			for(var i = 0; i < this.players.length; i++){
				var first = this.deck.peekCard();
				var second = this.deck.peekCard();
				var hand = new Hand(first, second);
				this.players[i].addHand(hand);
			}
		}
	}
};

module.exports = Table;