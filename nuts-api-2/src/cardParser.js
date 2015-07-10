var Card = function(name, value, color){
	this.name = name;
	this.value = value;
	this.color = color;
};
Card.prototype = {
	toString: function(){
		return this.name;
	}
}

var CardParser = function(){
	this.values = {
		"2": 2,
		"3": 3,
		"4": 4,
		"5": 5,
		"6": 6,
		"7": 7,
		"8": 8,
		"9": 9,
		"T": 10,
		"J": 11,
		"Q": 12,
		"K": 13,
		"A": 14
	};

	this.colors = {
		"c" : "Club",
		"d" : "Diamond",
		"h" : "Heart",
		"s" : "Spade"
	};
};
CardParser.prototype = {
	parse : function (faceValue) {
		
		if(faceValue.length < 2)
			throw Error("The input string is invalid.");

		if (faceValue.length === 2)
			return this._parseOne(faceValue);

		var cards = [];
		var faceValues = faceValue.split(" ");
		for (var i in faceValues)
		{
			cards.push(this._parseOne(faceValues[i]));
		}

		return cards;
	},
	_parseOne: function(faceValue){
		if (faceValue.length !== 2)
			throw Error("The input string is invalid.");
		
		var valueInitial = faceValue.substr(0, 1);
		var value = this.values[valueInitial];

		var colorInitial = faceValue.substr(1, 1);
		var color = this.colors[colorInitial];

		if (value == undefined || color == undefined)
			throw Error("The input string is invalid.");

		return new Card(faceValue, value, color);
	}
};

module.exports.CardParser = new CardParser();
module.exports.Card = Card;
