var assert = require("assert");
var Deck = require("../src/deck");

describe('Deck', function(){
	it('Doit contenir 52 cartes', function(){
		var deck = new Deck();
		assert.equal(deck.getRemainingCardCount(), 52);
	});

	it('Doit donner une carte à la demande', function(){
		var deck = new Deck();
		var card = deck.peekCard();
		assert(typeof card, "Card");
	});

	it('Ne doit jamais donner la même carte', function(){
		var deck = new Deck();
		var cardA = deck.peekCard();
		var cardB = deck.peekCard();
		assert.notDeepEqual(cardA, cardB);
	});
});