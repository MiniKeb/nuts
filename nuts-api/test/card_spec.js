var assert = require("assert");
var Card = require("../src/card");

describe('Card', function(){
	it('Doit pouvoir avoir une valeur numérique', function(){
		var card = new Card(2, "Spade");
		assert.equal(card.value, 2);
		assert.equal(card.rank, 2);
	});

	it('Doit pouvoir avoir une autre valeur numérique', function(){
		var card = new Card(9, "Spade");
		assert.equal(card.value, 9);
		assert.equal(card.rank, 9);
	});

	it('Ne doit pas avoir une valeur numérique inférieur à 2', function(){
		var impossibleCard = function() { new Card(1, "Spade"); };
		assert.throws(impossibleCard, Error);
	});

	it('Ne doit pas avoir une valeur numérique supérieur à 10', function(){
		var impossibleCard = function() { new Card(11, "Spade"); };
		assert.throws(impossibleCard, Error);
	});

	it('Doit accepter une valeur textuelle pour le valet', function(){
		var card = new Card("J", "Spade");
		assert.equal(card.value, "J");
		assert.equal(card.rank, 11);
	});

	it('Doit accepter une valeur textuelle pour l\'as', function(){
		var card = new Card("A", "Spade");
		assert.equal(card.value, "A");
		assert.equal(card.rank, 14);
	});

	it('Ne doit pas accepter n\'importe quelle valeur textuelle', function(){
		var impossibleCard = function(){ new Card("X", "Spade"); };
		assert.throws(impossibleCard, Error);
	});

	it('Doit y avoir un ordre de grandeur dans les cartes', function(){
		var smallCard = new Card(3, "Spade");
		var middleCard = new Card(8, "Spade");
		var bigCard = new Card("J", "Spade");
		var biggestCard = new Card("A", "Spade");

		assert(smallCard.compareTo(middleCard) < 0);
		assert(bigCard.compareTo(middleCard) > 0);
		assert(biggestCard.compareTo(biggestCard) === 0);
	});

	it('Doit avoir une couleur sur une lettre', function(){
		var card = new Card("A", "C");
		assert.equal(card.color, "♣");
	});

	it('Doit avoir une couleur en texte entier', function(){
		var card = new Card("A", "Diamond");
		assert.equal(card.color, "♦");
	});
});
