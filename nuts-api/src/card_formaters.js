var Colors = require("./colors").Colors;
var Values = require("./values").Values;
var Card = require("./card");

//"Vcn", "Vcs", "Value-ColorName"
var CardFormaters = {
	"Vcn" : {
		parse : function(cardString){
			if (cardString.length > 2)
				throw Error("The input string is invalid.");
			
			var valueInitial = cardString.substr(0, 1);
			var value = Values.getByInitial(valueInitial);

			var colorInitial = cardString.substr(1, 1);
			var color = Colors.getByInitial(colorInitial);

			return new Card(value, color);
		},
		format : function(card){
			var value = card.value.toString().toUpperCase();
			var colorInitial = card.color.initial.toLowerCase();
			return value + colorInitial;
		}
	}
};

module.exports = CardFormaters;