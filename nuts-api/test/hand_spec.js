var assert = require("assert");
var Helpers = require("../test/helpers").Helpers;

describe('Hand', function(){

	it('Doit indiquer les cartes en main', function(){
		var cardA = Helpers.createCard("5s");
		var cardB = Helpers.createCard("5h");
		var hand = Helpers.createHand("5s", "5h");
		assert.deepEqual(hand[0], cardA);
		assert.deepEqual(hand[1], cardB);
	});

});
