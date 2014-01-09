var CardParser = require("../src/card_parser");
var Hand = require("../src/hand");
var Player = require("../src/player");

var Helpers = {
	createCard : function(text){
		var parser = new CardParser("Vcn");
		return parser.parse(text);
	},

	createHand : function(firstCard, secondCard){
		return new Hand(this.createCard(firstCard), this.createCard(secondCard));
	},

	createPlayer : function(name, firstCard, secondCard){
		var player = new Player(name);
		player.addHand(this.createHand(firstCard, secondCard));
		return player;
	},

	createBoard : function(first, second, third, fourth, fifth){
		return [
			this.createCard(first),
			this.createCard(second),
			this.createCard(third),
			this.createCard(fourth),
			this.createCard(fifth),
		];
	}
};

exports.Helpers = Helpers;