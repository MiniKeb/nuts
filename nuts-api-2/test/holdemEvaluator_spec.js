var assert = require("assert");
var cardParser = require("../src/cardParser").CardParser;
var HoldemEvaluator = require("../src/holdemEvaluator");
var _ = require("underscore")._;

describe('Holdem Evaluator', function(){
	it("Ne doit pas évaluer moins de 7 cartes", function(){
		var evaluator = new HoldemEvaluator();
		var cardsSets = [
			"Ac",
			"Ac As",
			"Ac As Ah",
			"Ac As Ah Ad",
			"Ac As Ah Ad Ks",
			"Ac As Ah Ad Ks Kd"
		];

		for(var i in cardsSets){
			var cards = cardParser.parse(cardsSets[i]);
			var evaluate = function(){ evaluator.evaluate(cards); };
			assert.throws(evaluate, null, cardsSets[i].toString() + " should throw an error.");
		}
	});

	it("Doit évaluer 7 cartes", function(){
		var evaluator = new HoldemEvaluator();
		var cards = cardParser.parse("Ac As Ah Ad Ks Kd Kh");

		var evaluate = function(){ evaluator.evaluate(cards); };

		assert.doesNotThrow(evaluate);
	});

	it("Ne doit pas évaluer 8 cartes et plus", function(){
		var evaluator = new HoldemEvaluator();
		var cards = cardParser.parse("Ac As Ah Ad Ks Kd Kh Kc");

		var evaluate = function(){ evaluator.evaluate(cards); };

		assert.throws(evaluate);
	});

	it("Ne doit pas avoir 2 cartes identiques", function(){
		var evaluator = new HoldemEvaluator();
		var cards = cardParser.parse("Ac Ac 9h 5d 4s");

		var evaluate = function(){ evaluator.evaluate(cards); };

		assert.throws(evaluate);
	});

	it("Doit évaluer un kicker As", function(){
		var evaluator = new HoldemEvaluator();
		var cards = cardParser.parse("Ac Ts 9h 5d 4s 2d Qh");

		var result = evaluator.evaluate(cards);

		assert.equal(result.name, "Kicker");
		assertArrayEquality(result.cards, cardParser.parse("Ac Qh Ts 9h 5d"));
	});

	it("Doit évaluer une paire de deux", function(){
		var evaluator = new HoldemEvaluator();
		var cards = cardParser.parse("2c 2s 9h 5d 4s Ad Qh");

		var result = evaluator.evaluate(cards);

		assert.equal(result.name, "Pair");
		assertArrayEquality(result.cards, cardParser.parse("2s 2c Ad Qh 9h"));
	});

	it("Doit évaluer une paire d'As", function(){
		var evaluator = new HoldemEvaluator();
		var cards = cardParser.parse("2c 3s Ah 6d 4s Ad Qh");

		var result = evaluator.evaluate(cards);

		assert.equal(result.name, "Pair");
		assertArrayEquality(result.cards, cardParser.parse("Ad Ah Qh 6d 4s"));
	});

	it("Doit évaluer une paire de 4 et une paire de deux", function(){
		var evaluator = new HoldemEvaluator();
		var cards = cardParser.parse("2c 2s 4d 9h 4s Ad Qh");

		var result = evaluator.evaluate(cards);

		assert.equal(result.name, "Double Pair");
		assertArrayEquality(result.cards, cardParser.parse("4s 4d 2s 2c Ad"));
	});

	it("Doit évaluer un brelan par les 6", function(){
		var evaluator = new HoldemEvaluator();
		var cards = cardParser.parse("6c 6s 4d 6h Ad Qh 2c");

		var result = evaluator.evaluate(cards);

		assert.equal(result.name, "Three of a Kind");
		assertArrayEquality(result.cards, cardParser.parse("6s 6h 6c Ad Qh"));
	});

	it("Doit évaluer une suite", function(){
		var evaluator = new HoldemEvaluator();
		var cards = cardParser.parse("6c 7s 9d Th 8d Qh 2c");

		var result = evaluator.evaluate(cards);

		assert.equal(result.name, "Straight");
		assertArrayEquality(result.cards, cardParser.parse("Th 9d 8d 7s 6c"));
	});

	it("Doit évaluer une plus grande suite dans une suite", function(){
		var evaluator = new HoldemEvaluator();
		var cards = cardParser.parse("2c 3s 4d 5c 6d 7h 8d");

		var result = evaluator.evaluate(cards);

		assert.equal(result.name, "Straight");
		assertArrayEquality(result.cards, cardParser.parse("8d 7h 6d 5c 4d"));
	});

	it("Doit évaluer une suite même avec une paire", function(){
		var evaluator = new HoldemEvaluator();
		var cards = cardParser.parse("2c 3s 4d 5c 6d 7h 2d");

		var result = evaluator.evaluate(cards);

		assert.equal(result.name, "Straight");
		assertArrayEquality(result.cards, cardParser.parse("7h 6d 5c 4d 3s"));
	});

	it("Doit évaluer une petite suite avec un as", function(){
		var evaluator = new HoldemEvaluator();
		var cards = cardParser.parse("As 2c 3s 4d 5c 7h 7d");

		var result = evaluator.evaluate(cards);

		assert.equal(result.name, "Straight");
		assertArrayEquality(result.cards, cardParser.parse("5c 4d 3s 2c As"));
	});

	it("Doit évaluer une couleur", function(){
		var evaluator = new HoldemEvaluator();
		var cards = cardParser.parse("6c Tc 9c Th 8c Qc 2d");

		var result = evaluator.evaluate(cards);

		assert.equal(result.name, "Flush");
		assertArrayEquality(result.cards, cardParser.parse("Qc Tc 9c 8c 6c"));
	});

	it("Doit évaluer un full aux dames par les 10", function(){
		var evaluator = new HoldemEvaluator();
		var cards = cardParser.parse("6c Tc Qh Qd Td Qc 2d");

		var result = evaluator.evaluate(cards);

		assert.equal(result.name, "Full");
		assertArrayEquality(result.cards, cardParser.parse("Qh Qd Qc Td Tc"));
	});

	it("Doit évaluer un carré de valet", function(){
		var evaluator = new HoldemEvaluator();
		var cards = cardParser.parse("Jc Tc Jh Jd Td Js Ts");

		var result = evaluator.evaluate(cards);

		assert.equal(result.name, "Four of a Kind");
		assertArrayEquality(result.cards, cardParser.parse("Jc Jh Jd Js Ts"));
	});

	it("Doit évaluer une quinte flush", function(){
		var evaluator = new HoldemEvaluator();
		var cards = cardParser.parse("Ts 8c Js Ks Qs 9s 8s");

		var result = evaluator.evaluate(cards);

		assert.equal(result.name, "Straight Flush");
		assertArrayEquality(result.cards, cardParser.parse("Ks Qs Js Ts 9s"));
	});

	it("Ne doit pas évaluer une quinte flush", function(){
		var evaluator = new HoldemEvaluator();
		var cards = cardParser.parse("Th 8c Js Ks Qs 9s 8s");

		var result = evaluator.evaluate(cards);

		assert.notEqual(result.name, "Straight Flush");
		assertArrayEquality(result.cards, cardParser.parse("Ks Qs Js 9s 8s"));
	});

	it("Doit valider que les combinaisons sont dans l'ordre croissant de score", function(){
		var evaluator = new HoldemEvaluator();

		var combinations = [
			//Kicker
			cardParser.parse("2s 3c 4d 5h 7d 8h 9c"), 
			cardParser.parse("As Kc Qh Js 9d 8d 7c"), 
			
			//Pair
			cardParser.parse("2s 2c 3d 4s 5d 8h 7c"), 
			cardParser.parse("As Ac Kh 8s Qd Jd 9c"), 

			//Double Pair
			cardParser.parse("2s 2c 3d 3s 5d 6d 7c"),
			cardParser.parse("As Ac Kd Ks Qd Jd 9c"),

			//Brelan
			cardParser.parse("2s 2c 2d 4s 5d 6d 7c"),
			cardParser.parse("As Ac Ad 3s 4d 5d 6c"),
			
			//Suite
			cardParser.parse("2s 3s 4s 5s 6h 2d 2c"),
			cardParser.parse("As Ks Qs Js Th 2d 2c"),

			//Couleur
			cardParser.parse("2s 3s 4s 5s 6s 2d 2c"),
			cardParser.parse("As Ks Qs Js 9s 2d 2c"),

			//Full
			cardParser.parse("2s 2c 2d 3s 3d 4d 4c"),
			cardParser.parse("As Ac Ad Ks Kd 2d 2c"),

			//Carré
			cardParser.parse("2s 2c 2d 2h As 3d 3c"),
			cardParser.parse("As Ac Ad Ah 2s 2d 2c"),
			
			//Quinte Flush
			cardParser.parse("Ks Qs Js Ts 9s 2d 2c"),
			cardParser.parse("As Ks Qs Js Ts 2d 2c"),
		];

		var previousScore = 0;
		var previousCombi = [];
		for(var c in combinations){
			var currentCombi = combinations[c];
			var result = evaluator.evaluate(currentCombi);
			//console.log(result.name +" : "+ result.score);
			var message = "\r\nPrevious : "+ previousCombi +" ("+ previousScore 
				+")\r\nCurrent : "+ currentCombi +" ("+ result.score +")";
			assert(previousScore < result.score, message);
			previousScore = result.score;
			previousCombi = currentCombi;
		}
	});

	function assertArrayEquality(first, second){
		var name = function(c){ return c.name; };
		var firstCards = _.map(_.sortBy(first, name), name);
		var secondCards = _.map(_.sortBy(second, name), name);
		var diff = _.union(firstCards, secondCards);
		var message = "";
		if(first.length == second.length){
			diff = _.difference(firstCards, secondCards);
			message = "The arrays have some differences : \r\n ["+ firstCards.toString() +"] \r\n ["+ secondCards.toString() +"]";
		}
		else{
			message = "The arrays should have the same length: \r\n"+ firstCards.toString() + "\r\n"+ secondCards.toString();
		}
		assert.deepEqual(diff, [], message);
	}
});
