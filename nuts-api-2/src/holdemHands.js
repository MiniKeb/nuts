var _ = require("underscore")._;

var ArrayHelper = {
	without : function(full, subArray){
		var result = full;
		for(var s in subArray){
			var remove = _.findWhere(full, subArray[s]);
			result = _.without(result, remove);
		}
		return result;
	}
}

var HoldemHand = function(name, handCards, score){
	this.name = name;
	this.cards = handCards;
	this.score = score;
};

var StraightFlush = function(flush, straight){
	this.flush = flush;
	this.straight = straight;
	this.nextHand = null;
};
StraightFlush.prototype = {
	setNextHand: function(hand){
		this.nextHand = hand;
		return this;
	},
	process: function(){
		if(this._isStraightFlush())
			return this._getHand();

		return this.nextHand.process();
	},
	_isStraightFlush: function(){
		
		var isFlush = this.flush.length > 0;	
		var isStraight = this.straight.length >= 5; 

		return isStraight
			&& isFlush
			&& this._isPerfectMatch();
	},
	_isPerfectMatch: function(){
		var byName = function(card){ return card.name; };
		var allMatch = true;
		for(var s in this.straight){
			var isMatch = false;
			for(var f in this.flush){
				if(this.straight[s].name === this.flush[f].name){
					isMatch = true;
				}
			}
			allMatch &= isMatch;			
		}

		return allMatch;
	},
	_getHand: function(){
		var handCards = _.first(this.straight, 5);
		return new HoldemHand("Straight Flush", handCards, this._getScore(handCards));
	},
	_getScore: function(handCards){
		return handCards[0].value
			+ handCards[1].value
			+ handCards[2].value
			+ handCards[3].value
		 	// Moyen dégueulasse pour les petites suites. (5 4 3 2 A)
			+ ((handCards[4].value == 14) ? 1 : handCards[4].value)
			+ 8000;
		return result;
	}
}

var FourOfKind = function(allCards, fourOfKind){
	this.cards = allCards;
	this.fourOfKind = fourOfKind;
	this.nextHand = null;
};
FourOfKind.prototype = {
	setNextHand: function(hand){
		this.nextHand = hand;
		return this;
	},
	process: function(){
		if(this.fourOfKind.length > 0)
			return this._getHand();

		return this.nextHand.process();
	},
	_getHand: function(){
		var otherCards = ArrayHelper.without(this.cards, this.fourOfKind);
		var handCards = _.union(this.fourOfKind, _.first(otherCards, 1));
		return new HoldemHand("Four of a Kind", handCards, this._getScore(handCards));
	},
	_getScore: function(handCards){
		return _.reduce(handCards, function(memo, card){
			return memo + card.value;
		}, 7000);
	}
}

var Full = function(threeOfKind, pairs){
	this.threeOfKind = threeOfKind;
	this.pairs = pairs;
	this.nextHand = null;
};
Full.prototype = {
	setNextHand: function(hand){
		this.nextHand = hand;
		return this;
	},
	process: function(){
		if(this._isFull())
			return this._getHand();

		return this.nextHand.process();
	},
	_isFull: function(){ 
		var containsThreeOfKind = this.threeOfKind.length > 0;
		var containsPair = this.pairs.length >= 2;
		return containsThreeOfKind && containsPair;
	},
	_getHand: function(){
		var handCards = _.union(this.threeOfKind, _.first(this.pairs, 2));
		return new HoldemHand("Full", handCards, this._getScore(handCards));
	},
	_getScore: function(handCards){
		return _.reduce(handCards, function(memo, card){
			return memo + card.value;
		}, 6000);
	}
}

var Flush = function(flush){
	this.flush = flush;
	this.nextHand = null;
};
Flush.prototype = {
	setNextHand: function(hand){
		this.nextHand = hand;
		return this;
	},
	process: function(){
		if(this.flush.length > 0)
			return this._getHand();

		return this.nextHand.process();
	},
	_getHand: function(){
		var handCards = _.first(this.flush, 5);
		return new HoldemHand("Flush", handCards, this._getScore(handCards));
	},
	_getScore: function(handCards){
		return _.reduce(handCards, function(memo, card){
			return memo + card.value;
		}, 5000);
	}
}

var Straight = function(straight){
	this.straight = straight;
	this.nextHand = null;
};
Straight.prototype = {
	setNextHand: function(hand){
		this.nextHand = hand;
		return this;
	},
	process: function(){
		if(this.straight.length >= 5)
			return this._getHand();

		return this.nextHand.process();
	},
	_getHand: function(){
		var handCards = _.first(this.straight, 5);
		return new HoldemHand("Straight", handCards, this._getScore(handCards));
	},
	_getScore: function(handCards){
		return handCards[0].value
			+ handCards[1].value
			+ handCards[2].value
			+ handCards[3].value
		 	// Moyen dégueulasse pour les petites suites. (5 4 3 2 A)
			+ ((handCards[4].value == 14) ? 1 : handCards[4].value)
			+ 4000;
	}
}

var ThreeOfKind = function(allCards, threeOfKind){
	this.cards = allCards;
	this.threeOfKind = threeOfKind;
	this.nextHand = null;
};
ThreeOfKind.prototype = {
	setNextHand: function(hand){
		this.nextHand = hand;
		return this;
	},
	process: function(){
		if(this.threeOfKind.length == 3)
			return this._getHand();

		return this.nextHand.process();
	},
	_getHand: function(){
		var remaingCards = ArrayHelper.without(this.cards, this.threeOfKind);
		var handCards = _.union(this.threeOfKind, _.first(remaingCards, 2));
		return new HoldemHand("Three of a Kind", handCards, this._getScore(handCards));
	},
	_getScore: function(handCards){
		return _.reduce(handCards, function(memo, card){
			return memo + card.value;
		}, 3000);
	}
}

var DoublePair = function(allCards, pairs){
	this.cards = allCards;
	this.pairs = pairs;
	this.nextHand = null;
};
DoublePair.prototype = {
	setNextHand: function(hand){
		this.nextHand = hand;
		return this;
	},
	process: function(){
		if(this.pairs.length == 4)
			return this._getHand();

		return this.nextHand.process();
	},
	_getHand: function(){
		var remaingCards = ArrayHelper.without(this.cards, this.pairs);
		var handCards = _.union(this.pairs.reverse(), _.first(remaingCards, 1));
		return new HoldemHand("Double Pair", handCards, this._getScore(handCards));
	},
	_getScore: function(handCards){
		var result = ((handCards[0].value + handCards[1].value) * 14)
		+ handCards[2].value 
		+ handCards[3].value
		+ handCards[4].value
		+ 2000;
		return result;
		// return _.reduce(handCards, function(memo, card){
		// 	return memo + card.value;
		// }, 200);
	}
}

var Pair = function(allCards, pairs){
	this.cards = allCards;
	this.pairs = pairs;
	this.nextHand = null;
};
Pair.prototype = {
	setNextHand: function(hand){
		this.nextHand = hand;
		return this;
	},
	process: function(){
		if(this.pairs.length == 2)
			return this._getHand();

		return this.nextHand.process();
	},
	_getHand: function(){
		var remaingCards = ArrayHelper.without(this.cards, this.pairs);
		var handCards = _.union(this.pairs, _.first(remaingCards, 3));
		return new HoldemHand("Pair", handCards, this._getScore(handCards));
	},
	_getScore: function(handCards){
		return _.reduce(handCards, function(memo, card){
			return memo + card.value;
		}, 1000);
	}
}

var Kicker = function(allCards){
	this.cards = allCards;
};
Kicker.prototype = {
	process: function(){
		return this._getHand();
	},
	_getHand: function(){
		var handCards = _.first(_.sortBy(this.cards, function(card){ return card.value; }).reverse(), 5);
		return new HoldemHand("Kicker", handCards, this._getScore(handCards));
	},
	_getScore: function(handCards){
		return _.reduce(handCards, function(memo, card){
			return memo + card.value;
		}, 0);
	}
}

module.exports.HoldemHand = HoldemHand;
module.exports.StraightFlush = StraightFlush;
module.exports.FourOfKind = FourOfKind;
module.exports.Full = Full;
module.exports.Flush = Flush;
module.exports.Straight = Straight;
module.exports.ThreeOfKind = ThreeOfKind;
module.exports.DoublePair = DoublePair;
module.exports.Pair = Pair;
module.exports.Kicker = Kicker;