var _ = require("underscore")._;

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
		var valueCount = _.countBy(cards, function(card){ return card.value.name; });
		var occurence = _.filter(valueCount, function(value){ if (value != 1) return value; });

		var hasQuinte = this._hasQuinte(cards);
		var hasFlush = this._hasFlush(cards);
		var hasSquare = _.contains(occurence, 4);
		var hasBrelan = _.contains(occurence, 3);
		var hasPair = _.contains(occurence, 2);
		var pairCount = _.filter(occurence, function(num){ return num == 2; }).length;
		
		var higherCombination = { name : "Kicker", score : 1 };

		if(!hasBrelan && hasPair && pairCount == 1)
			higherCombination = { name : "Pair", score : 2 };
		else if(hasPair && pairCount >= 2)
			higherCombination = { name : "DoublePair", score : 3 };
		else if (hasBrelan && !hasPair)
			higherCombination = { name : "Brelan", score : 4 };
		else if (hasQuinte)
			higherCombination = { name : "Quinte", score : 5 };
		else if (hasFlush)
			higherCombination = { name : "Flush", score : 6 };
		else if (hasBrelan && hasPair)
			higherCombination = { name : "Full", score : 7 };
		else if (hasSquare)
			higherCombination = { name : "Square", score : 8 };
		else if (hasQuinte && hasFlush)
			higherCombination = { name : "QuinteFlush", score : 9 };

		return higherCombination;
	},

	_hasQuinte : function(cards){
		var getRank = function(card){ return card.value.rank; };
		var sortedCards = _.sortBy(_.uniq(cards, false, getRank), getRank);

		var count = 0;
		for(var i = 0; i < sortedCards.length-1; i++){
			if ((sortedCards[i].value.rank + 1) == sortedCards[i+1].value.rank){
				if(++count > 3)
					return true;
			}else{
				count = 0;
			}
		}

		return false;
	},

	_hasFlush : function(cards){
		var colorCount = _.countBy(cards, function(card){ return card.color.name; });
		var hasFlush = false;

		for(var color in colorCount){
			if (colorCount[color] > 4)
				hasFlush = true;
		}

		return hasFlush;
	}
};

module.exports = Evaluator;