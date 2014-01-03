var Colors = require("../src/colors");
//"Vcn", "Vcs", "Value-ColorName"
var CardFormaters = {
	"Vcn" : {
		parse : function(cardString){
			var separationIndex = (cardString.length > 2) ? 2 : 1;
			
			var value = cardString.substring(0, separationIndex);
			var colorInitial = cardString.substring(separationIndex, 1);
			var color = new Colors().getByInitial(colorInitial);

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