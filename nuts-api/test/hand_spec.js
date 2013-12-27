var assert = require("assert");
var Hand = require("../src/hand");
var Card = require("../src/card");

describe('Hand', function(){
	it('Doit lever une exception quand les cartes sont identiques', function(){
		var card = new Card(5, "S");
		var impossibleHand = function(){ new Hand(card, card); };
		assert.throws(impossibleHand, Error);
	});
});
