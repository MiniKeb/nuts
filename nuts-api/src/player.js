var Player = function(name){
	this.name = name;
};
Player.prototype = {
	seatTo: function(table){
		table.addPlayer(this);
	},

	addHand: function(hand){
		this.hand = hand;
	}
};

module.exports = Player;