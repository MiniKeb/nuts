var _ = require("underscore")._;

var Colors = {
	Club : {
		sign : '♣',
		initial : 'c',
		name : "Club"
	},

	Diamond : {
		sign : '♦',
		initial : 'd',
		name : "Diamond"
	},

	Heart : {
		sign : '♥',
		initial : 'h',
		name : "Heart"
	},

	Spade : {
		sign : '♠',
		initial : 's',
		name : "Spade"
	},

	getAll : function() { return [Colors.Club, Colors.Diamond, Colors.Heart, Colors.Spade]; },

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
	},

	contains : function(color){
		return _.contains(this.getAll(), color);
	},

	_get : function (selector) {
		return _.find(this.getAll(), selector);
	}
};

exports.Colors = Colors;