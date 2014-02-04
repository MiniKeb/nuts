var assert = require("assert");
var Player = require("../src/player");
var Game = require("../src/game");

describe('Game', function(){
	it.skip("Doit lancer une exception s'il n'a pas de joueur", function(){
		var buildGame = function(){ new Game(); };
		assert.throws(buildGame);
	});

	it("Doit avoir des joueurs", function(){
		var a = new Player("Alfred", 10);
		var b = new Player("Bernard", 10);
		var c = new Player("Chris", 10);

		var game = new Game([a, b, c]);
		assert.deepEqual(game.players, [a, b, c]);
	});
});