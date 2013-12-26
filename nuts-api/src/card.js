var cardHelpers = {
	getRank : function(value){
		var rank = 0;
		if (isNaN(value)){
			switch(value){
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
	},

	getColor: function(colorTxt){
		var color = "";

		//Spade, Heart, Diamond, Club
		// ♠ ♥ ♦ ♣
		switch(colorTxt){
			case "S":
			case "Spade":
			case "spade":
			case "SPADE":
				color = "♠";
				break;

			case "H":
			case "Heart":
			case "heart":
			case "HEART":
				color = "♥";
				break;

			case "D":
			case "Diamond":
			case "diamond":
			case "DIAMOND":
				color = "♦";
				break;

			case "C":
			case "Club":
			case "club":
			case "CLUB":
				color = "♣";
				break;

			default:
				throw Error("The color is not valid");
		}

		return color;
	}
};

var Card = function(value, color){
	//var values = ["2", "3", "4", "5", "6", "7", "8", "9", "J", "Q", "K", "A"];
	
	if (value < 2 || value > 10)
		throw Error("The numeric card value should be between 2 and 10");

	this.value = value;
	this.rank = cardHelpers.getRank(value);
	this.color = cardHelpers.getColor(color);
};
Card.prototype = {
	compareTo : function (anotherCard) {
		return this.rank - anotherCard.rank;
	}
};


module.exports = Card;