var _ = require("underscore")._;

var cardHelpers = {
	getRank : function(value){
		var rank = 0;
		if (isNaN(value)){
			switch(value.toUpperCase()){
				case "J":
					rank = 11;
					break;

				case "Q":
					rank = 12;
					break;
				
				case "K":
					rank = 13;
					break;
				
				case "A":
					rank = 14;
					break;
				
				default:
					throw Error("The value is not valid");
			}
		}else{
			rank = value;
		}
		return rank;
	}
};

var Card = function(value, color){
	if (value < 2 || value > 10)
	{
		throw Error("The numeric card value should be between 2 and 10.");
	}

	if (!_.contains(["♣", "♦", "♥", "♠"], color))
	{
		throw Error("The color should be '♣', '♦', '♥' or '♠'.");
	}

	this.value = value;
	this.rank = cardHelpers.getRank(value);
	this.color = color;
};
Card.prototype = {
	compareTo : function (anotherCard) {
		return this.rank - anotherCard.rank;
	},

	equals : function(anotherCard) {
		return this.value == anotherCard.value && this.color == anotherCard.color;
	}
};


module.exports = Card;