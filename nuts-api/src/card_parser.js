var _ = require("underscore")._;
var Card = require("./card");
var CardFormaters = require("./card_formaters");

var CardParser = function(format){
	if (CardFormaters[format] === undefined) {
		throw new Error("Unsupported format");
	} else {
		this.formater = CardFormaters[format];
	}
};
CardParser.prototype = {
	parse : function(cardString){
		return this.formater.parse(cardString);
	},
	format : function(card){
		return this.formater.format(card);
	}
};

module.exports = CardParser;