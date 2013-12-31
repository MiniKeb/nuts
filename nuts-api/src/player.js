var Player = function(name){
	this.name = name;
};
Player.prototype = {
	seatTo: function(table){
		table.addPlayer(this);
	}
};

module.exports = Player;