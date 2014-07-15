var _ = require("underscore")._;

var Higher = function(name, rank, combination, allCards){
	this.name = name;
	this.rank = rank;
	this.combination = combination;
	this.allCards = allCards;
	this.kickers = this._getKickers(allCards, combination);
	this.score = this._getScore(this.allCards, this.rank);
};
Higher.prototype = {
	_getScore : function(all, rank){
		return (rank * 1000000)
			+ (all[0].value.rank * 10000)
			+ (all[1].value.rank * 100)
			+ _.reduce(_.last(all, 3), function(memo, card){ return memo + card.value.rank; }, 0);
	},
	_getKickers : function(cards, combination) {
		var remain = _.sortBy(_.difference(cards, combination), function(card){ return card.value.rank; }).reverse();
		var kickerCount = 5 - combination.length;
		return _.first(remain, kickerCount);
	}
};

var Evaluator = function(board, players){
	var isEmpty = function(array) {
		return array === null || array === undefined || _.isEmpty(array);
	};

	if (isEmpty(board)){
		throw Error("It should exists a board with cards.");
	}

	if (isEmpty(players)){
		throw Error("It should exists some players.");
	}

	this.board = board;
	this.players = players;
};
Evaluator.prototype = {
	getWinner : function(){
		var best = { player : null, combination : null };

		for (var i = 0; i < this.players.length; i++){
			var currentPlayer = this.players[i];
			var combination = this._getBestCombination(currentPlayer);
			
			if (best.player === null || best.combination.score < combination.score)
			{
				best = { player : currentPlayer, combination : combination };
			}
		}

		return best;
	},

	_getBestCombination : function(player){
		var cards = _.union(this.board, player.hand);
		return this._getHigherCombination(cards);
	},

	_getHigherCombination: function(cards){
		var higher = null;

		var combinations = this._getCombinations(cards);

		if (!_.isEmpty(combinations.quinteFlush)) {
			higher = new Higher("Quinte Flush", 9, combinations.quinteFlush, cards);
		} else if (!_.isEmpty(combinations.square)) {
			higher = new Higher("Four of a Kind", 8, combinations.square, cards);
		} else if (!_.isEmpty(combinations.brelan) && !_.isEmpty(combinations.pairs)) {
			var highPair = _.max(combinations.pairs, function (pair) { return pair[0].value.rank; });
			var combi = _.union(combinations.brelan, highPair);
			higher = new Higher("Full", 7, combi, cards);
		} else if (!_.isEmpty(combinations.flush)) {
			higher = new Higher("Flush", 6, combinations.flush, cards);
		} else if (!_.isEmpty(combinations.quinte)) {
			higher = new Higher("Quinte", 5, combinations.quinte, cards);
		} else if (!_.isEmpty(combinations.brelan)) {
			higher = new Higher("Three of a Kind", 4, combinations.brelan, cards);
		} else if (!_.isEmpty(combinations.pairs)) {
			var highPairs = _.first(_.sortBy(combinations.pairs, function (pair) { return pair[0].value.rank; }).reverse(), 2);
			var combina = _.flatten(highPairs);
			higher = new Higher(combinations.pairs.length > 1 ? "Two Pairs" : "Pair",
				combinations.pairs.length > 1 ? 3 : 2,
				combina,
				cards);
		} else {
			var kickers = _.first(_.sortBy(cards, function(card){ return card.value.rank; }).reverse(), 5);
			higher = new Higher("Kicker", 1, kickers, cards);
		}

		return higher;
	},

	_getCombinations : function(cards){
		var combinations = {
			quinteFlush : [],
			flush : [],
			quinte : [],
			square : [],
			brelan : [],
			pairs : []
		};

		var cardByColor = _.groupBy(cards, function(card){ return card.color.name; });
		
		for(var color in cardByColor){
			if (cardByColor[color].length > 4)
			{
				var quinteFlush = this._getQuinte(cardByColor[color]);
				if (!_.isEmpty(quinteFlush)){
					combinations.quinteFlush = cardByColor[color];
				}else{
					combinations.flush = cardByColor[color];
				}
			}
		}

		var quinte = this._getQuinte(cards);
		if (!_.isEmpty(quinte)){
			combinations.quinte = quinte;
		}

		var cardByValue = _.groupBy(cards, function(card){ return card.value.name; });

		for(var cardName in cardByValue){
			switch(cardByValue[cardName].length){
				case 4:
					combinations.square = cardByValue[cardName];
					break;

				case 3:
					combinations.brelan = cardByValue[cardName];
					break;

				case 2:
					if (_.isEmpty(combinations.pairs)){
						combinations.pairs[0] = cardByValue[cardName];
					} else {
						combinations.pairs[combinations.pairs.length] = cardByValue[cardName];
					}
					break;
			}
		}

		return combinations;
	},

	_getQuinte : function(cards){
		var sortedCards = _.sortBy(cards, function(card){ return card.value.rank; }).reverse();

		var quinte = [];
		var prevRank = 0;
		for (var i = 0; i < sortedCards.length; i++){
			var currentRank = sortedCards[i].value.rank;
			if (quinte.length < 5){
				if (prevRank === 0 || prevRank == currentRank + 1){
					prevRank = currentRank;
					quinte.push(currentRank);
				} else if (prevRank != currentRank) {
					prevRank = currentRank;
					quinte = [currentRank];
				}
			}
		}

		return quinte.length == 5 ? quinte : null;
	}
};

module.exports = Evaluator;