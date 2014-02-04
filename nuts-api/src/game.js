var extend = require("node.extend");
var EventEmitter = require("events").EventEmitter;

var Game = function(players){
	this.players = players;
};
Game.prototype = extend({}, EventEmitter.prototype, {
});

module.exports = Game;