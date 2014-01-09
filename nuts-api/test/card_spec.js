var assert = require("assert");
var Card = require("../src/card");
var Colors = require("../src/colors").Colors;
var Values = require("../src/values").Values;

describe('Card', function(){
	it('Doit pouvoir avoir une valeur numérique', function(){
		var card = new Card(Values[2], Colors.Spade);
		assert.equal(card.value, Values[2]);
	});

	it('Doit pouvoir avoir une autre valeur numérique', function(){
		var card = new Card(Values[9], Colors.Spade);
		assert.equal(card.value, Values[9]);
		assert.equal(card.value.rank, 9);
	});

	it('Ne doit pas avoir une valeur numérique inférieur à 2', function(){
		var impossibleCard = function() { new Card(Values[1], Colors.Spade); };
		assert.throws(impossibleCard, Error);
	});

	it('Ne doit pas avoir une valeur numérique supérieur à 10', function(){
		var impossibleCard = function() { new Card(Values[11], Colors.Spade); };
		assert.throws(impossibleCard, Error);
	});

	it('Doit accepter une valeur textuelle pour le valet', function(){
		var card = new Card(Values.Jack, Colors.Spade);
		assert.equal(card.value, Values.Jack);
		assert.equal(card.value.rank, 11);
	});

	it('Doit accepter une valeur textuelle pour l\'as', function(){
		var card = new Card(Values.Ace, Colors.Spade);
		assert.equal(card.value, Values.Ace);
		assert.equal(card.value.rank, 14);
	});

	it('Ne doit pas accepter n\'importe quelle valeur textuelle', function(){
		var impossibleCard = function(){ new Card(Values.X, Colors.Spade); };
		assert.throws(impossibleCard, Error);
	});

	it('Doit avoir un ordre de grandeur dans les cartes', function(){
		var smallCard = new Card(Values[3], Colors.Spade);
		var middleCard = new Card(Values[8], Colors.Spade);
		var bigCard = new Card(Values.Jack, Colors.Spade);
		var biggestCard = new Card(Values.Ace, Colors.Spade);

		assert(smallCard.compareTo(middleCard) < 0);
		assert(bigCard.compareTo(middleCard) > 0);
		assert(biggestCard.compareTo(biggestCard) === 0);
	});

	it('Doit avoir une couleur en texte entier', function(){
		var card = new Card(Values.Ace, Colors.Diamond);
		assert.equal(card.color, Colors.Diamond);
	});

	it("Doit accepter une couleur par son signe", function(){
		var createCard = function(){ new Card(Values.Ace, Colors.Spade); };
		
		assert.doesNotThrow(createCard, Error);
	});
});
