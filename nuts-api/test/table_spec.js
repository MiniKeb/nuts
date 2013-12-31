var assert = require("assert");
var Table = require("../src/table");
var Player = require("../src/player");

describe('Table', function(){
	it("Peut ajouter un joueur", function(){
		var table = new Table();

		var addPlayer = function() {
			var joe = new Player("Joe");
			table.addPlayer(joe);
		}
		
		assert.doesNotThrow(addPlayer);
	});

	it("Ne peut pas commencer avec moins de 2 joueurs", function(){
		var table = new Table();
		addPlayers(table, ["Alfred"]);
		assert(!table.canStart);
	});

	it("Peut commencer avec 2 joueurs au moins", function(){
		var table = new Table();
		addPlayers(table, ["Alfred", "Benoit", "Christian"]);
		assert(table.canStart);
	});

	it.skip("Doit distribuer 2 cartes à chaque joueur", function(){
		var table = new Table();

		var players = addPlayers(table, ["Alfred", "Benoit", "Christian"]);
		
		assert.doesNotThrow(table.distribute);
		assert.equals(players.Alfred.Hand)

	})

	function addPlayers(table, names){
		var players = {};
		for(var i = 0; i < names.length; i++){
			var name = names[i];
			var player = new Player(name);
			
			players[name] = player;

			table.addPlayer(player);
		}

		return players;
	}
});