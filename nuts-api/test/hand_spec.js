var assert = require("assert");
var Hand = require("../src/hand");

describe('Hand', function(){
	it('Doit lever une exception quand les cartes sont identiques', function(){
		//Spade, Heart, Diamond, Club
		// ♠ ♥ ♦ ♣
		var impossibleHand = function(){ new Hand("5-S", "5-S"); };
		assert.throws(impossibleHand, Error);
	});
});
