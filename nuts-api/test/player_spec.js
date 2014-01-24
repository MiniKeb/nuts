var assert = require("assert");
var Player = require("../src/player");
var Table = require("../src/table");
var Hand = require("../src/hand");
var Card = require("../src/card");
var Colors = require("../src/colors").Colors;
var Values = require("../src/values").Values;

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
		var hand = new Hand(new Card(Values[5], Colors.Spade), new Card(Values[8], Colors.Heart));
		player.addHand(hand);

		assert.deepEqual(player.hand, hand);
	});

	it("Doit avoir des jetons", function(){
		var player = new Player("Bill", 500);

		assert.equal(player.stackAmount, 500);
	});

	it("Peut miser un montant", function(){
		var player = new Player("Bill", 500);
		player.bet(100);
		assert.equal(player.stackAmount, 400);
	});

	it("Doit emettre un événement lorsqu'il a misé", function(){
		var player = new Player("Bill", 500);

		var hasPlayed = false;
		player.on("Bet", function(){
			hasPlayed = true;
		});

		assert(!hasPlayed);
		player.bet(100);
		assert(hasPlayed);
	});

	it("Ne doit pas pouvoir miser plus que ce qu'il a", function(){
		var player = new Player("Bill", 500);
		player.bet(600);
		assert.equal(player.stackAmount, 0);
	});
});