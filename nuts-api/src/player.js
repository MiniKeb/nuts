var extend = require("node.extend");
var EventEmitter = require("events").EventEmitter;

var Player = function(name, stackAmount){
	this.name = name;
	this.stackAmount = stackAmount;
	this.betAmount = 0;
	this.talk = false;
};
Player.prototype = extend({}, EventEmitter.prototype, {
	seatTo: function(table){
		table.addPlayer(this);
	},

	addHand: function(hand){
		this.hand = hand;
	},

	bet: function(amount){
		if (this.stackAmount < amount){
			amount = this.stackAmount;
		}
		this.stackAmount = this.stackAmount - amount;
		this.emit("Bet", amount);
	},

	fold: function(){
		this.emit("Folded");
	},

	check: function(){
		this.emit("Checked");
	}
});

module.exports = Player;