var Table = function(){
	this.players = new Array();
	this.canStart = false;
};
Table.prototype = {
	addPlayer : function (player){
		this.players.push(player);
		if (this.players.length > 1){
			this.canStart = true;
		}
	},
}

module.exports = Table;