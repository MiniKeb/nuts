var _ = require("underscore")._;

var Values = {
	"2" : {
		name : "Two",
		initial : '2',
		rank : 2
	},

	"3" : {
		name : "Three",
		initial : '3',
		rank : 3
	},

	"4" : {
		name : "Four",
		initial : '4',
		rank : 4
	},

	"5" : {
		name : "Five",
		initial : '5',
		rank : 5
	},

	"6" : {
		name : "Six",
		initial : '6',
		rank : 6
	},

	"7" : {
		name : "Seven",
		initial : '7',
		rank : 7
	},

	"8" : {
		name : "Eight",
		initial : '8',
		rank : 8
	},

	"9" : {
		name : "Nine",
		initial : '9',
		rank : 9
	},

	"10" : {
		name : "Ten",
		initial : 'T',
		rank : 10
	},

	Jack : {
		name : "Jack",
		initial : 'J',
		rank : 11
	},

	Queen : {
		name : "Queen",
		initial : 'Q',
		rank : 12
	},

	King : {
		name : "King",
		initial : 'K',
		rank : 13
	},

	Ace : {
		name : "Ace",
		initial : 'A',
		rank : 14
	},

	getAll : function(){
		return [
			Values[2],
			Values[3],
			Values[4],
			Values[5],
			Values[6],
			Values[7],
			Values[8],
			Values[9],
			Values[10],
			Values.Queen,
			Values.Jack,
			Values.King,
			Values.Ace
		];
	},

	getByInitial : function (initial) {
		var selector = function(c){ return c.initial.toUpperCase() == initial.toUpperCase(); };
		return this._get(selector);
	},

	contains : function(value){
		return _.contains(this.getAll(), value);
	},

	_get : function (selector) {
		return _.find(this.getAll(), selector);
	}
};

exports.Values = Values;