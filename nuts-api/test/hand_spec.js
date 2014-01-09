var assert = require("assert");
var Helpers = require("../test/helpers").Helpers;

describe('Hand', function(){
	it('Doit lever une exception quand les cartes sont identiques', function(){
		var card = Helpers.createCard("5s");
		var impossibleHand = function(){ new Hand(card, card); };
		assert.throws(impossibleHand, Error);
	});

	it('Doit indiquer les cartes en main', function(){
		var cardA = Helpers.createCard("5s");
		var cardB = Helpers.createCard("5h");
		var hand = Helpers.createHand("5s", "5h");
		assert.deepEqual(hand.firstCard, cardA);
		assert.deepEqual(hand.secondCard, cardB);
	});

	it("Doit indiquer si c'est une pair", function(){
		var hand = Helpers.createHand("5s", "5h");
		assert(hand.isPair());
	});

	it("Doit ranger les cartes par ordre de valeur", function(){
		var hand = Helpers.createHand("Qs", "Kh");
		var first = Helpers.createCard("Kh");
		var second = Helpers.createCard("Qs");
		
		assert.deepEqual(hand.firstCard, first);
		assert.deepEqual(hand.secondCard, second);
	});
});
