var _ = require("underscore")._;

var Higher = function(name, rank, combination, kickers){
	this.name = name;
	this.rank = rank;
	this.combination = combination;
	this.kickers = kickers;
	this.all = _.union(this.combination, this.kickers);
	this.score = (this.rank * 1000000) + (all[0].value.rank * 10000) + (all[1].value.rank * 100) + _.sum(_.last(all, 3), getRank);
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
		var cards = _.union(this.board, [player.hand.firstCard, player.hand.secondCard]);
		return this._getHigherCombination(cards);
	},

	_getHigherCombination: function(cards){
		var getRank = function(card){ return card.value.rank; };

		var higher = {
			name : "",
			rank : 0,
			combination : [],
			kickers : [],
			getScore : function(){
				var all = _.union(this.combination, this.kickers);
				return (this.rank * 1000000) + (all[0].value.rank * 10000) + (all[1].value.rank * 100) + _.sum(_.last(all, 3), getRank);
			}
		};

		var getKickers = function(combi) {
			var remain = _.sortBy(_.difference(cards, combi), getRank).reverse();
			var kickerCount = 5 - combi.length;
			return _.first(remain, kickerCount);
		};

		var combinations = this._getCombinations(cards);

		if (!_.isEmpty(combinations.quinteFlush))
		{
			higher = {
				name : "Quinte Flush",
				rank : 9,
				combination : combinations.quinteFlush,
				kickers : getKickers(combinations.quinteFlush)
			};
		} else if (!_.isEmpty(combinations.square)) {
			higher = {
				name : "Four of a Kind",
				rank : 8,
				combination : combinations.square,
				kickers : getKickers(combinations.square)
			};
		} else if (!_.isEmpty(combinations.brelan) && !_.isEmpty(combinations.pairs)) {
			var highPair = _.max(combinations.pairs, function (pair) { return pair[0].value.rank; });
			var combi = _.union(combinations.brelan, highPair);
			higher = {
				name : "Full",
				rank : 7,
				combination : combi,
				kickers : getKickers(combi)
			};
		} else if (!_.isEmpty(combinations.flush)) {
			higher = {
				name : "Flush",
				rank : 6,
				combination : combinations.flush,
				kickers : getKickers(combinations.flush)
			};
		} else if (!_.isEmpty(combinations.quinte)) {
			higher = {
				name : "Quinte",
				rank : 5,
				combination : combinations.quinte,
				kickers : getKickers(combinations.quinte)
			};
		} else if (!_.isEmpty(combinations.brelan)) {
			higher = {
				name : "Three of a Kind",
				rank : 4,
				combination : combinations.brelan,
				kickers : getKickers(combinations.brelan)
			};
		} else if (!_.isEmpty(combinations.pairs)) {
			var highPairs = _.first(_.sortBy(combinations.pairs, function (pair) { return pair[0].value.rank; }).reverse(), 2);
			var combina = _.flatten(highPairs);
			higher = {
				name : combinations.pairs.length > 1 ? "Two Pairs" : "Pair",
				rank : combinations.pairs.length > 1 ? 3 : 2,
				combination : combina,
				kickers : getKickers(combina)
			};
		} else {
			var kickers = _.first(_.sortBy(cards, getRank).reverse(), 5);
			higher = {
				name : "Kicker",
				rank : 1,
				combination : kickers,
				kickers : []
			};
		}

		return higher;
	},

	_getCombinations : function(cards){
		var combinations = {
			quintFlush : [],
			flush : [],
			quinte : [],
			square : [],
			brelan : [],
			pairs : []
		};

		var cardByColor = _.groupBy(cards, function(card){ return card.color.name; });
		
		for(var color in cardByColor){
			if (cardByColor[color] > 4)
			{
				if (_isQuinte(cardByColor[color])){
					combinations.quinteFlush = cardByColor[color];
				}else{
					combinations.flush = cardByColor[color];
				}
			}
		}

		var distinctCards = _.uniq(cards, false, getRank);
		if (_isQuinte(distinctCards)){
			combinations.quinte = distinctCards;
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

	_isQuinte : function(cards){
		var sortedCards = _.sortBy(cards, function(card){ return card.value.rank; });

		var isQuinte = cards.length == 5;
		for(var i = 1; i < sortedCards.length; i++){
			var firstRank = sortedCards[0].value.rank;
			var currentRank = sortedCards[i].value.rank;
			isQuinte &= currentRank - firstRank == i;
		}

		return isQuinte;
	}

/*	
	_hasFlush : function(cards){
		var colorCount = _.countBy(cards, function(card){ return card.color.name; });
		var hasFlush = false;

		for(var color in colorCount){
			if (colorCount[color] > 4)
				hasFlush = true;
		}

		return hasFlush;
	}
*/
};

module.exports = Evaluator;