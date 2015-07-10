var assert = require("assert");
var cardParser = require("../src/cardParser").CardParser;
var Card = require("../src/cardParser").Card;

describe('Parser', function(){
	it("Ne doit pas parser 'A' seul", function(){
		var parsing = function(){ 
			var card = cardParser.parse("A"); 
		};
		assert.throws(parsing);
	});

	it("Ne doit pas parser 'nimportequoi'", function(){
		var parsing = function(){ 
			var card = cardParser.parse("nimportequoi"); 
		};
		assert.throws(parsing);
	});

	it("Ne doit pas parser 'Qv'", function(){
		var parsing = function(){ 
			var card = cardParser.parse("Qv"); 
		};
		assert.throws(parsing);
	});

	it("Ne doit pas parser 'Vc'", function(){
		var parsing = function(){ 
			var card = cardParser.parse("Vc"); 
		};
		assert.throws(parsing);
	});
	
	it("Doit parser la carte 'Ac'", function(){
		var card = cardParser.parse("Ac");
		var expectedCard = new Card("Ac", 14, "Club");
		assert.deepEqual(card, expectedCard);
	});

	it("Doit parser la carte 'Ts'", function(){
		var card = cardParser.parse("Ts");
		var expectedCard = new Card("Ts", 10, "Spade");
		assert.deepEqual(card, expectedCard);
	});

	it("Doit parser la carte '9d'", function(){
		var card = cardParser.parse("9d");
		var expectedCard = new Card("9d", 9, "Diamond");
		assert.deepEqual(card, expectedCard);
	});

	it("Doit parser la carte 'Qh'", function(){
		var card = cardParser.parse("Qh");
		var expectedCard = new Card("Qh", 12, "Heart");
		assert.deepEqual(card, expectedCard);
	});

	it("Doit parser plusieurs carte d'un coup", function(){
		var cards = cardParser.parse("As 3h 9c Jd Qh");
		var expectedCards = [
			new Card("As", 14, "Spade"),
			new Card("3h", 3, "Heart"),
			new Card("9c", 9, "Club"),
			new Card("Jd", 11, "Diamond"),
			new Card("Qh", 12, "Heart"),
		];

		assert.deepEqual(cards, expectedCards);
	});

	it("Ne doit parser aucune cartes si une est mauvaise", function(){
		var cards;
		var parsing = function(){ cards = cardParser.parse("As 3h 9c Vd Qh"); };
		assert.throws(parsing);
		assert.equal(cards, undefined);
	});
});