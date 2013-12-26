var assert = require("assert");
var Card = require("../src/card");

describe('Card', function(){
	it('Doit pouvoir avoir une valeur numérique', function(){
		//Spade, Heart, Diamond, Club
		// ♠ ♥ ♦ ♣
		var card = new Card(2, "Spade");
		assert.equal(card.value, 2);
	});

	it('Doit pouvoir avoir une autre valeur numérique', function(){
		//Spade, Heart, Diamond, Club
		// ♠ ♥ ♦ ♣
		var card = new Card(9, "Spade");
		assert.equal(card.value, 9);
	});
});
