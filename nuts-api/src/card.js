var _ = require("underscore")._;
var Colors = require("./colors").Colors;
var Values = require("./values").Values;

var Card = function(value, color){
	if (!Values.contains(value))
	{
		throw Error("The value "+ value +" is not managed.");
	}

	if (!Colors.contains(color))
	{
		throw Error("The color should be 'Club : ♣', 'Diamond : ♦', 'Heart : ♥' or 'Spade : ♠'.");
	}

	this.value = value;
	this.color = color;
};
Card.prototype = {
	compareTo : function (anotherCard) {
		return this.value.rank - anotherCard.value.rank;
	},

	equals : function(anotherCard) {
		return this.value === anotherCard.value && this.color === anotherCard.color;
	}
};


module.exports = Card;