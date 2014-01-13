var assert = require("assert");
var _ = require("underscore")._;
var Evaluator = require("../src/evaluator");
var Helpers = require("./helpers").Helpers;

describe('Evaluator', function(){
	it("Doit avoir un board pour évaluer", function(){
		var createEvaluator = function() { new Evaluator(null, null); };
		assert.throws(createEvaluator, Error);
	});

	it("Doit avoir des joueurs pour évaluer", function(){
		var board = Helpers.createBoard("2s", "5h", "8c", "Td", "Ks");
		var createEvaluator = function() { new Evaluator(board, null); };
		assert.throws(createEvaluator, Error);
	});

	it("Indique que la meilleure combinaison de la main est un carré", function(){
		var square = getCards(["5h", "5c", "5d", "5s", "2s", "3s", "4s"]);
		var evaluator = getEvaluatorForPrivateMethod();

		assert.equal(evaluator._getHigherCombination(square).name, "Four of a Kind");
	});

	it("Indique que la meilleure combinaison de la main est un full", function(){
		var full = getCards(["5h", "5c", "5d", "2s", "2s", "3s", "4s"]);
		var evaluator = getEvaluatorForPrivateMethod();

		assert.equal(evaluator._getHigherCombination(full).name, "Full");
	});

	it("Indique que la meilleure combinaison de la main est un brelan", function(){
		var brelan = getCards(["5h", "5c", "5d", "As", "2s", "3s", "4s"]);
		var evaluator = getEvaluatorForPrivateMethod();

		assert.equal(evaluator._getHigherCombination(brelan).name, "Three of a Kind");
	});

	it("Indique que la meilleure combinaison de la main est une double paires", function(){
		var doublePair = getCards(["5h", "5c", "Ad", "As", "2s", "3s", "4s"]);
		var evaluator = getEvaluatorForPrivateMethod();

		assert.equal(evaluator._getHigherCombination(doublePair).name, "Two Pairs");
	});

	it("Indique que la meilleure combinaison de la main est une paire", function(){
		var pair = getCards(["5h", "Tc", "Ad", "As", "2s", "3s", "4s"]);
		var evaluator = getEvaluatorForPrivateMethod();

		assert.equal(evaluator._getHigherCombination(pair).name, "Pair");
	});

	it("Indique que Chloe gagne avec une couleur", function(){
		var data = {
			board : ["2s", "5h", "6s", "Td", "Ks"],
			players : {
				"Alfred" : ["3h", "4c"],
				"Bill" : ["8h", "Jh"],
				"Chloe" : ["7s", "9s"]
			}
		};

		assertWinner(data, { player : "Chloe", combination : "Flush" });
	});

	it("Indique que Alfred gagne avec une suite", function(){
		var data = {
			board : ["2s", "5h", "6s", "Td", "Ks"],
			players : {
				"Alfred" : ["3h", "4c"],
				"Bill" : ["8h", "Jh"],
				"Chloe" : ["7s", "9c"]
			}
		};

		assertWinner(data, { player : "Alfred", combination : "Quinte" });
	});

	it("Indique que Bill gagne avec la suite la plus haute", function(){
		var data = {
			board : ["4s", "5h", "6s", "Td", "Ks"],
			players : {
				"Alfred" : ["3h", "2c"],
				"Bill" : ["7s", "8c"],
				"Chloe" : ["8h", "Jh"]
			}
		};

		assertWinner(data, { player : "Bill", combination : "Quinte" });
	});

	it("Indique que Bill gagne avec les kickers", function() {
		var data = {
			board : ["2s", "5h", "8c", "Td", "Ks"],
			players : {
				"Alfred" : ["3h", "4c"],
				"Bill" : ["7h", "Jh"],
				"Chloe" : ["7s", "9d"]
			}
		};

		assertWinner(data, { player : "Bill", combination : "Kicker" });
	});

	it("Indique que Chloe gagne avec une quinte flush royale", function(){
		var data = {
			board : ["7s", "5h", "Js", "Ts", "Ks"],
			players : {
				"Alfred" : ["Qh", "4s"],
				"Bill" : ["8s", "9s"],
				"Chloe" : ["Qs", "As"]
			}
		};

		assertWinner(data, { player : "Chloe", combination : "Quinte Flush" });
	});
	

	it("Indique que Alfred gagne avec une paire", function(){
		var data = {
			board : ["2s", "5h", "8c", "Td", "Ks"],
			players : {
				"Alfred" : ["2h", "4c"],
				"Bill" : ["7h", "Jh"],
				"Chloe" : ["7s", "9d"]
			}
		};

		assertWinner(data, { player : "Alfred", combination : "Pair" });
	});

	function getCards(cards){
		var array = [];
		for(var i = 0; i < cards.length; i++){
			var card = Helpers.createCard(cards[i]);
			array.push(card);
		}
		return array;
	}

	function getEvaluatorForPrivateMethod(){
		var board = ["Board", "en", "cartons"];
		var fake = ["Joueurs", "en", "cartons"];

		return new Evaluator(board, fake);
	}

	function assertWinner(data, winner){
		var board = Helpers.createBoard(data.board[0], data.board[1], data.board[2], data.board[3], data.board[4]);
		var players = [];
		for(var key in data.players) {
			var player = Helpers.createPlayer(key, data.players[key][0], data.players[key][1]);
			players.push(player);
		}

		var evaluated = new Evaluator(board, players).getWinner();

		assert.equal(evaluated.player.name, winner.player);
		assert.equal(evaluated.combination.name, winner.combination);
	}

});