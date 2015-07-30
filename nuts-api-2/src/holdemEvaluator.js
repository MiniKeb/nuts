var _ = require("underscore")._;

var StraightFlush = require("./holdemHands").StraightFlush;
var FourOfKind = require("./holdemHands").FourOfKind;
var Full = require("./holdemHands").Full;
var Flush = require("./holdemHands").Flush;
var Straight = require("./holdemHands").Straight;
var ThreeOfKind = require("./holdemHands").ThreeOfKind;
var DoublePair = require("./holdemHands").DoublePair;
var Pair = require("./holdemHands").Pair;
var Kicker = require("./holdemHands").Kicker;

var HoldemEvaluator = function(){
};
HoldemEvaluator.prototype = {
	evaluate : function(cards){
		var start = new Date().getTime();
		
		if (!Array.isArray(cards) || cards.length != 7)
			throw Error("You should provide 7 cards to evaluate them.");

		var cardByName = _.groupBy(cards, function(card){ return card.name; });
		if (_.any(cardByName, function(grouping){ return grouping.length > 1; }))
			throw Error("You can not provide twice the same card.");

		var cards = _.sortBy(cards, function(card){ return card.value; }).reverse();
		var combinations = new CombinationAnalyzer();
		combinations.analyze(cards);

		var handChain = new StraightFlush(combinations.flush, combinations.straight)
			.setNextHand(new FourOfKind(cards, combinations.fourOfKind)
			.setNextHand(new Full(combinations.threeOfKind, combinations.pairs)
			.setNextHand(new Flush(combinations.flush)
			.setNextHand(new Straight(combinations.straight)
			.setNextHand(new ThreeOfKind(cards, combinations.threeOfKind)
			.setNextHand(new DoublePair(cards, combinations.pairs)
			.setNextHand(new Pair(cards, combinations.pairs)
			.setNextHand(new Kicker(cards) ))))))));

		return handChain.process();
	}
}

var CombinationAnalyzer = function(){
	this.pairs = [];
	this.threeOfKind = [];
	this.fourOfKind = [];
	this.straight = [];
	this.flush = [];
};
CombinationAnalyzer.prototype = {
	analyze: function(sortedCards){
		this._processByColor(sortedCards);
		this._processByValue(sortedCards);
		this._processSequence(sortedCards);
	},

	_processByColor: function(cards){
		var cardsByColor = _.groupBy(cards, function(card){	return card.color; });
		for(var color in cardsByColor){
			this._setOfColor(cardsByColor[color]);
		}
	},

	_setOfColor: function(cardsOfColor){
		if(cardsOfColor.length >= 5){
			this.flush = cardsOfColor;
		}
	},

	_processByValue: function(cards){
		var cardsByValue = _.groupBy(cards, function(card){	return card.value; });
		for(var value in cardsByValue){
			this._setOfKind(cardsByValue[value]);
		}
	},

	_setOfKind: function(cardsOfKind){
		var property = this._getPropertyOfKind(cardsOfKind);
		this[property] = _.union(this[property], cardsOfKind);
	},

	_getPropertyOfKind: function(cardsOfKind){
		switch(cardsOfKind.length){
			case 2 : return "pairs";
			case 3 : return "threeOfKind";
			case 4 : return "fourOfKind";
			default : return null;
		}
	},

	_processSequence: function(sortedCards){

		var groupBySequence = sortedCards.reduce(function(accumulation, item, index){
			if(index === 0)
				return [[item]];

			var lastArray = accumulation[accumulation.length - 1];
			var lastItem = lastArray[lastArray.length - 1];
			
			if(lastItem.value - 1 === item.value){
				lastArray.push(item); // append to current sequence

				if(item.value === 2){
					var aces = sortedCards.filter(function(card){ return card.value === 14; });
					var betterAce = aces.filter(function(ace){ return ace.color === item.color; });
					if(betterAce.length === 1)
						lastArray.push(betterAce[0]);
					else if(aces.length > 0)
						lastArray.push(aces[0]);
				}
			}
			else
				accumulation.push([item]); // create new sequence

			return accumulation;
		}, []);
		this.straight = groupBySequence.reduce(function(best, current){ return (current.length >= 5) ? current : best; }, []);
	}
}

module.exports = HoldemEvaluator;