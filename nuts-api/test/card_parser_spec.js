var assert = require("assert");
var CardParser = require("../src/card_parser");
var Card = require("../src/card");
var Colors = require("../src/colors").Colors;
var Values = require("../src/values").Values;

// On utilise v pour la valeur et c pour la couleur de la carte dans les formats.
describe('CardParser', function(){
	it('Doit refuser le format Value-ColorSign', function(){
		var createParser = function(){ new CardParser("Value-ColorSign"); };
		assert.throws(createParser, Error);
	});

	it('Doit accepter le format Vcn', function(){
		var createParser = function(){ new CardParser("Vcn"); };
		assert.doesNotThrow(createParser, Error);
	});

	it('Doit parser le format Vcn', function(){
		var parser = new CardParser("Vcn");
		var expected = new Card(Values[5], Colors.Club);

		assert.deepEqual(parser.parse("5c"), expected);
	});

	it('Doit parser le format Vcn avec les valeurs textuelles', function(){
		var parser = new CardParser("Vcn");
		var expected = new Card(Values[10], Colors.Club);

		assert.deepEqual(parser.parse("Tc"), expected);
	});

	it("Doit formater au format Vcn", function(){
		var parser = new CardParser("Vcn");
		var card = new Card(Values[10], Colors.Club);

		assert.equal(parser.format(card), "Tc");
	});
});