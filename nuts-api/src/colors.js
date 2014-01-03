var _ = require("underscore")._;

var Club = {
	sign : '♣',
	initial : 'c',
	name : "Club"
};

var Diamond = {
	sign : '♦',
	initial : 'd',
	name : "Diamond"
};

var Heart = {
	sign : '♥',
	initial : 'h',
	name : "Heart"
};

var Spade = {
	sign : '♠',
	initial : 's',
	name : "Spade"
};

var Colors = function(){
	this._colors = [Club, Diamond, Heart, Spade];
};
Colors.prototype = {
	_get : function (selector) {
		return _.find(this._colors, selector);
	},

	getByName : function (name) {
		var selector = function(c){ return c.name.toLowerCase() == name.toLowerCase(); };
		return this._get(selector);
	},

	getBySign : function (sign) {
		var selector = function(c){ return c.sign.toLowerCase() == sign.toLowerCase(); };
		return this._get(selector);
	},

	getByInitial : function (initial) {
		var selector = function(c){ return c.initial.toLowerCase() == initial.toLowerCase(); };
		return this._get(selector);
	}
};

module.exports = Colors;