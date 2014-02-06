var extend = require("node.extend");
var _ = require("underscore")._;
var EventEmitter = require("events").EventEmitter;
var Hand = require("./hand");
var Deck = require("./deck");
var Evaluator = require("../src/evaluator");

var Game = function(players){
	if(_.isEmpty(players))
		throw new Error("Game should have players.");
	
	this.players = players;
	this.deck = new Deck();
	this.step = 0;

	this.cards = [];

	this.smallBlindAmount = 1;
	this.bigBlindAmount = 2;

	this.smallBlindPlayer = this.players[0];
	this.bigBlindPlayer = this.players[1];
	
	this.currentPlayer = this.players.length > 2 ? this.players[2] : this.players[0];

	this.pot = 0;
};
Game.prototype = extend({}, EventEmitter.prototype, {
	start : function(){
		this._betAmount(this.smallBlindPlayer, this.smallBlindAmount);
		this.smallBlindPlayer.emit("SmallBlind", this.smallBlindAmount);
		this._betAmount(this.bigBlindPlayer, this.bigBlindAmount);
		this.bigBlindPlayer.emit("BigBlind", this.bigBlindAmount);
		this._distribute();

		this.currentPlayer.actions = this._getAvailableActions();
	},

	nextToken: function(){
		if (this.players.length == 1){
			this.players[0].stackAmount += this.pot;
			this.players[0].emit("Won", null);
			this.emit("Finished");
		}else{
			var allPlayed = _.every(this.players, function(p) { return p.hasPlayed; });
			var firstBet = this.players[0].betAmount;
			var allSameAmount = _.every(this.players, function(p) { return firstBet == p.betAmount; });
			
			if(allPlayed && allSameAmount) {
				this._loadBoard();
			} else {
				this.currentPlayer = this._getNextPlayer();
				this.currentPlayer.actions = this._getAvailableActions();
			}
		}
	},

	_distribute : function(){
		for(var i = 0; i < this.players.length; i++){
			var first = this.deck.peekCard();
			var second = this.deck.peekCard();
			var hand = new Hand(first, second);
			this.players[i].addHand(hand);
			this.players[i].hasPlayed = false;
		}
	},

	_loadBoard: function(){
		this.step++;
		switch(this.step){
			case 1: // Flop
				this.cards.push(this.deck.peekCard());
				this.cards.push(this.deck.peekCard());
				this.cards.push(this.deck.peekCard());
				break;

			case 2: // Turn
				this.cards.push(this.deck.peekCard());
				break;

			case 3: //River
				this.cards.push(this.deck.peekCard());
				break;

			default:
				var winner = new Evaluator(this.cards, this.players).getWinner();
				winner.player.stackAmount += this.pot;
				winner.player.emit("Won", winner.combination);
				this.emit("Finished");
				break;
		}

		var pot = 0;
		_.each(this.players, function(p){
			pot += p.betAmount;
			p.betAmount = 0;
			p.hasPlayed = false;
		});
		this.pot += pot;
		this.currentPlayer = this.smallBlindPlayer;
		this.currentPlayer.actions = this._getAvailableActions();
	},

	_getAvailableActions: function(){
		var self = this;
		var actions = {};
		var previousPlayer = self._getPreviousPlayer();

		var fold = function(){
			self._pushToPot(self.currentPlayer);

			self.players = _.without(self.players, self.currentPlayer);

			self.currentPlayer.emit("Folded");

			self.currentPlayer.actions = null;
			self.nextToken();
		};

		var bet = function(amount){
			self._betAmount(self.currentPlayer, amount);

			self.currentPlayer.emit("Bet");

			self.currentPlayer.hasPlayed = true;
			self.currentPlayer.actions = null;
			self.nextToken();
		};

		var call = function(){
			var amount = previousPlayer.betAmount - self.currentPlayer.betAmount;

			self._betAmount(self.currentPlayer, amount);

			self.currentPlayer.emit("Called");
			
			self.currentPlayer.hasPlayed = true;
			self.currentPlayer.actions = null;
			self.nextToken();
		};

		var check = function(){
			self.currentPlayer.emit("Checked");

			self.currentPlayer.hasPlayed = true;
			self.currentPlayer.actions = null;
			self.nextToken();
		};

		actions["fold"] = fold;

		if(self.currentPlayer.stackAmount > 0){
			actions["bet"] = bet;
		}
		
		if(previousPlayer.betAmount > self.currentPlayer.betAmount){
			actions["call"] = call;
		}

		if(previousPlayer.betAmount === self.currentPlayer.betAmount) {
			actions["check"] = check;
		}

		self.currentPlayer.emit("TokenObtained", { actions : actions, board : this.cards});
		return actions;
	},

	_betAmount: function(player, amount){
		if (player.stackAmount < amount){
			amount = player.stackAmount;
			player.emit("AllIn");
		}
		player.stackAmount -= amount;
		player.betAmount += amount;
	},

	_pushToPot: function(player){
		this.pot += player.betAmount;
		player.betAmount = 0;
	},

	_getPreviousPlayer: function(){
		var currentIndex = _.indexOf(this.players, this.currentPlayer);
		var previousIndex = (currentIndex - 1 < 0) ? this.players.length - 1 : currentIndex - 1;
		return this.players[previousIndex];
	},

	_getNextPlayer: function(){
		var currentIndex = _.indexOf(this.players, this.currentPlayer);
		var nextIndex = (currentIndex + 1 >= this.players.length) ? 0 : currentIndex + 1;
		return this.players[nextIndex];
	}
});

module.exports = Game;