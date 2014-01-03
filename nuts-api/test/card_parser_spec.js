var assert = require("assert");
var CardParser = require("../src/card_parser");
var Card = require("../src/card");

// On utilise v pour la valeur et c pour la couleur de la carte dans les formats.
describe('CardParser', function(){
	it('Doit accepter les formats Vcn, Vcs et Value-ColorName', function(){
		var createParsers = function(){
			var p1 = new CardParser("Vcn");
			var p2 = new CardParser("Vcs");
			var p3 = new CardParser("Value-ColorName");
		};

		assert.doesNotThrow(createParsers, Error);
	});

	it('Doit refuser les autres formats', function(){
		var createParsers = function(){
			var p1 = new CardParser("Value-cn");
			var p2 = new CardParser("V-cs");
			var p3 = new CardParser("Value-ColorSign");
		};

		assert.throws(createParsers, Error);
	});

	it.skip('Doit parser le format Vc', function(){
		var parser = new CardParser();
		var expected = new Card(5, "Spade");

		assert.deepEqual(parser.parse("5s"), expected);
	});
});