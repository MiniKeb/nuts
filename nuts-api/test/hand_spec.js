var assert = require("assert");
var Hand = require("../src/hand");
var Card = require("../src/card");

describe('Hand', function(){
	it('Doit lever une exception quand les cartes sont identiques', function(){
		var card = new Card(5, "♠");
		var impossibleHand = function(){ new Hand(card, card); };
		assert.throws(impossibleHand, Error);
	});

	it('Doit indiquer les cartes en main', function(){
		var cardA = new Card(5, "♠");
		var cardB = new Card(5, "♥");
		var hand = new Hand(cardA, cardB);
		assert.deepEqual(hand.firstCard, cardA);
		assert.deepEqual(hand.secondCard, cardB);
	});
});
