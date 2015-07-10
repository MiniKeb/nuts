var assert = require("assert");
var cardParser = require("../src/cardParser").CardParser;
var Player = require("../src/player");
var PokerEvaluator = require("../src/pokerEvaluator");
var HoldemEvaluator = require("../src/holdemEvaluator");
// var _ = require("underscore")._;

describe('Poker Evaluator', function(){
	it("Doit faire gagner J1 avec un kicker As", function(){
		var game = getGame("Qd Jc 9h 4s 2h", {
			"J1" : "As Kh",
			"J2" : "Ks 3s"
		});
		var winners = game.getWinners();

		assert.equal(winners.length, 1);
		assert.equal(winners[0].player.name, "J1");
		assert.equal(winners[0].hand.name, "Kicker");
	});

	it("Doit faire match nul avec les 5", function(){
		var game = getGame("Qd Jc 9h 4s 2h", {
			"J1" : "3c 5h",
			"J2" : "5c 3s"
		});

		var winners = game.getWinners();

		assert.equal(winners.length, 2);
	});

	it("Doit faire gagner J2 avec une paire", function(){
		var game = getGame("Qd Jc 9h 4s 2h", {
			"J1" : "3c 5h",
			"J2" : "5c 2s"
		});

		var winners = game.getWinners();

		assert.equal(winners.length, 1);
		assert.equal(winners[0].player.name, "J2");
		assert.equal(winners[0].hand.name, "Pair");
	});

	it("Doit faire gagner J1 avec une paire plus forte", function(){
		var game = getGame("Qd Jc 9h 4s 2h", {
			"J1" : "4c 5h",
			"J2" : "5c 2s"
		});

		var winners = game.getWinners();

		assert.equal(winners.length, 1);
		assert.equal(winners[0].player.name, "J1");
		assert.equal(winners[0].hand.name, "Pair");
	});

	it("Doit faire match nul avec les paires", function(){
		var game = getGame("Qd Jc 9h 4s 2h", {
			"J1" : "2c 5h",
			"J2" : "5c 2s"
		});

		var winners = game.getWinners();

		assert.equal(winners.length, 2);
	});

	it("Doit faire gagner J2 avec deux paires", function(){
		var game = getGame("Qd Jc 9h 4s 2h", {
			"J1" : "2c 5h",
			"J2" : "4c 2s"
		});

		var winners = game.getWinners();

		assert.equal(winners.length, 1);
		assert.equal(winners[0].player.name, "J2");
		assert.equal(winners[0].hand.name, "Double Pair");
	});

	it("Doit faire gagner J1 avec deux paires dont la 1ère est plus forte", function(){
		var game = getGame("Ad Kc 9h Qs 2h", {
			"J1" : "2c Ah",
			"J2" : "Qc Ks"
		});

		var winners = game.getWinners();

		assert.equal(winners.length, 1);
		assert.equal(winners[0].player.name, "J1");
		assert.equal(winners[0].hand.name, "Double Pair");
	});

	it("Doit faire gagner J2 avec une suite", function(){
		var game = getGame("2h 3s 4d 5c Th", {
			"J1" : "7c Ah",
			"J2" : "6c Ks"
		});

		var winners = game.getWinners();

		assert.equal(winners.length, 1);
		assert.equal(winners[0].player.name, "J2");
		assert.equal(winners[0].hand.name, "Straight");
	});

	it("Doit faire gagner J2 avec une suite de couleur", function(){
		var game = getGame("2s 3s 4s 5s Th", {
			"J1" : "7c As",
			"J2" : "6s Ks"
		});

		var winners = game.getWinners();

		assert.equal(winners.length, 1);
		assert.equal(winners[0].player.name, "J2");
		assert.equal(winners[0].hand.name, "Straight Flush");
	});

	function getBoard(cards){
		return cardParser.parse(cards);
	};
	
	function getGame(board, players){
		return new PokerEvaluator(new HoldemEvaluator())
			.setBoard(getBoard(board))
			.setPlayers(getPlayers(players));
	};

	function getPlayers(players){
		var realPlayers = [];

		for(var p in players){
			var player = new Player(p);
			player.setCards(cardParser.parse(players[p]));
			realPlayers.push(player);
		}

		return realPlayers;
	};
});