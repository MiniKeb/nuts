var Card = require("./card");

var DeckHelpers = {
	loadAllCards: function(){
		var colors = ["Spade", "Club", "Diamond", "Heart"];
		var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
		var cards = new Array();

		for(var c = 0; c < colors.length; c++){
			for (var v = 0; v < values.length; v++){
				cards.push(new Card(values[v], colors[c]));
			}
		}

		return DeckHelpers.shuffle(cards);
	},

	shuffle: function(cards){
		for(var j, x, i = cards.length; i; j = Math.floor(Math.random() * i), x = cards[--i], cards[i] = cards[j], cards[j] = x);
		{
			return cards;
		}
	}
};

var Deck = function(){
	this._cards = DeckHelpers.loadAllCards();
};

Deck.prototype = {
	getRemainingCardCount: function(){
		return this._cards.length;
	},
	peekCard : function(){
		return this._cards.pop();
	}
};

module.exports = Deck;