var _ = require("underscore")._;

var PokerEvaluator = function(handEvaluator){
	this.handEvaluator = handEvaluator;
	this.board = null;
	this.players = [];
};
PokerEvaluator.prototype = {
	setBoard: function(board){
		this.board = board;
		return this;
	},
	setPlayers: function(players){
		this.players = players;
		return this;
	},
	getWinners: function(){
		var bests = [];

		for(var i = 0; i < this.players.length; i++){
			var currentPlayer = this.players[i];
			var cards = _.union(currentPlayer.getCards(), this.board);
			var evaluation = this.handEvaluator.evaluate(cards);
			var temp = {
				player: currentPlayer, 
				hand: evaluation
			};
			if(bests.length == 0 || evaluation.score > bests[0].hand.score){
				bests = [temp];
			} else if(bests.length > 0 && evaluation.score == bests[0].hand.score){
				bests.push(temp);
			}
		}

		return bests;
	}
}

module.exports = PokerEvaluator;