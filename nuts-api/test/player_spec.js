var assert = require("assert");
var Player = require("../src/player");
var Table = require("../src/table");
var Hand = require("../src/hand");

describe('Player', function(){
	var table = new Table();

	it("Doit avoir un nom", function(){
		var player = new Player("Seb");
		assert.equal(player.name, "Seb");
	});

	it("Peut s'assoir à une table", function(){
		var player = new Player("Bill");
		var seating = function(){ player.seatTo(table); };
		assert.doesNotThrow(seating);
	});

	it("Peut avoir une main vide", function(){
		var player = new Player("Bill");
		assert.equal(player.hand, undefined);
	});

	it("Peut avoir une main avec des cartes", function(){
		var player = new Player("Bill");
		var hand = new Hand()
		player.addHand()
	});
});