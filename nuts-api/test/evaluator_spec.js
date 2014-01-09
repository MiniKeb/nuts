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

	it("Indique si une main est une couleur", function(){
		var trueHand = getCards(["2s", "5h", "Jc", "Ts", "Ks", "5s", "8s"]);
		var falseHand = getCards(["2s", "5h", "Jc", "Ts", "Ks", "5c", "8s"]);
		
		var evaluator = getEvaluatorForPrivateMethod();

		assert(evaluator._hasFlush(trueHand));
		assert(!evaluator._hasFlush(falseHand));
	});

	it("Indique si une main est une suite", function(){
		var trueHand = getCards(["9s", "5h", "Jc", "6s", "Ks", "Ts", "Qc"]);
		var falseHand = getCards(["9s", "5h", "Jc", "6s", "Ks", "7s", "4s"]);
		
		var evaluator = getEvaluatorForPrivateMethod();

		assert(evaluator._hasQuinte(trueHand));
		assert(!evaluator._hasQuinte(falseHand));
	});

	it("Indique que la meilleure combinaison de la main est un carré", function(){
		var square = getCards(["5h", "5c", "5d", "5s", "2s", "3s", "4s"]);
		var evaluator = getEvaluatorForPrivateMethod();

		assert.equal(evaluator._getHigherCombination(square).name, "Square");
	});

	it("Indique que la meilleure combinaison de la main est un full", function(){
		var full = getCards(["5h", "5c", "5d", "2s", "2s", "3s", "4s"]);
		var evaluator = getEvaluatorForPrivateMethod();

		assert.equal(evaluator._getHigherCombination(full).name, "Full");
	});

	it("Indique que la meilleure combinaison de la main est un brelan", function(){
		var brelan = getCards(["5h", "5c", "5d", "As", "2s", "3s", "4s"]);
		var evaluator = getEvaluatorForPrivateMethod();

		assert.equal(evaluator._getHigherCombination(brelan).name, "Brelan");
	});

	it("Indique que la meilleure combinaison de la main est une double paires", function(){
		var doublePair = getCards(["5h", "5c", "Ad", "As", "2s", "3s", "4s"]);
		var evaluator = getEvaluatorForPrivateMethod();

		assert.equal(evaluator._getHigherCombination(doublePair).name, "DoublePair");
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

	it.skip("Peut évaluer les kickers", function() {
		var data = {
			board : ["2s", "5h", "8c", "Td", "Ks"],
			players : {
				"Alfred" : ["3h", "4c"],
				"Bill" : ["7h", "Jh"],
				"Chloe" : ["7s", "9d"]
			}
		};

		assertWinner(data, "Bill");
	});

	it.skip("Peut évaluer une quinte flush royale", function(){
		var data = {
			board : ["2s", "5h", "Js", "Ts", "Ks"],
			players : {
				"Alfred" : ["Qh", "4c"],
				"Bill" : ["Kh", "Ah"],
				"Chloe" : ["Qs", "As"]
			}
		};

		assertWinner(data, "Chloe");
	});
	

	it.skip("Peut évaluer les paires", function(){
		var board = Helpers.createBoard("2s", "5h", "8c", "Td", "Ks");
		var players = [
			Helpers.createPlayer("Alfred", "2h", "4c"),
			Helpers.createPlayer("Bill", "7h", "Jh"),
			Helpers.createPlayer("Chloe", "7s", "9d")
		];

		var evaluator = new Evaluator(board, players);

		assert.equal(evaluator.getWinner().name, "Alfred");
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

		var evaluator = new Evaluator(board, players);

		assert.equal(evaluator.getWinner().player.name, winner.player);
		assert.equal(evaluator.getWinner().combination.name, winner.combination);
	}

});