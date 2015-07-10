var Player = function(name){
	this.name = name;
	this.cards = null;
};
Player.prototype = {
	setCards: function(cards){
		this.cards = cards;
	},
	getCards: function(){
		return this.cards;
	}
}

module.exports = Player;