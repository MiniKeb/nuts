var assert = require("assert");
var Table = require("../src/table");
var Player = require("../src/player");

describe('Table', function(){
	it("Peut ajouter un joueur", function(){
		var table = new Table();

		var addPlayer = function() {
			var joe = new Player("Joe");
			table.addPlayer(joe);
		};
		
		assert.doesNotThrow(addPlayer);
	});

	it("Peut supprimer un joueur", function(){
		var table = new Table();

		var joe = new Player("Joe");
		var bill = new Player("Bill");
	
		table.addPlayer(joe);
		table.addPlayer(bill);
	});

	it("Ne peut pas commencer avec moins de 2 joueurs", function(){
		var table = new Table();
		addPlayers(table, ["Alfred"]);
		assert(!table._canPlay());
	});

	it("Peut commencer avec 2 joueurs au moins", function(){
		var table = new Table();
		addPlayers(table, ["Alfred", "Benoit", "Christian"]);
		assert(table._canPlay());
	});

	it("Doit distribuer 2 cartes différentes à chaque joueur", function(){
		var table = new Table();
		
		var players = addPlayers(table, ["Alfred", "Benoit", "Christian"]);
		var distribute = function() { table.distribute(); };
		
		assert.doesNotThrow(distribute);
		assert.notDeepEqual(players["Alfred"].hand, players["Benoit"].hand);
		assert.notDeepEqual(players["Benoit"].hand, players["Christian"].hand);
		assert.notDeepEqual(players["Christian"].hand, players["Alfred"].hand);
	});

	it("Doit emettre un evenement à l'ajout d'un joueur", function(){
		var table = new Table();
		var isAdded = false;
		table.on("PlayerAdded", function(){
			isAdded = true;
		});

		assert(!isAdded);
		table.addPlayer(new Player("Jill"));
		assert(isAdded);
	});

	it("Doit prendre les blinds au début du tour", function(){
		var table = new Table(1);
		
		var alphonse = new Player("Alphonse", 1000);
		table.addPlayer(alphonse);
		
		var bernard = new Player("Bernard", 500);
		table.addPlayer(bernard);

		var christophe = new Player("Christophe", 250);
		table.addPlayer(christophe);

		table.preflop();

		assert.equal(alphonse.stackAmount, 999);
		assert.equal(bernard.stackAmount, 498);
		assert.equal(christophe.stackAmount, 250);
	});

	it("Doit prendre les blinds en décalant au début de chaque tour", function(){
		var table = new Table(1);
		
		var alphonse = new Player("Alphonse", 1000);
		table.addPlayer(alphonse);
		
		var bernard = new Player("Bernard", 500);
		table.addPlayer(bernard);

		var christophe = new Player("Christophe", 250);
		table.addPlayer(christophe);

		table.preflop();

		table.preflop();

		assert.equal(alphonse.stackAmount, 999);
		assert.equal(bernard.stackAmount, 497);
		assert.equal(christophe.stackAmount, 248);

		table.preflop();

		assert.equal(alphonse.stackAmount, 997);
		assert.equal(bernard.stackAmount, 497);
		assert.equal(christophe.stackAmount, 247);
	});

	it("Doit emettre un événement lorsqu'un joueur se couche", function(){
		var table = new Table(1);

		var alphonse = new Player("Alphonse", 1000);
		table.addPlayer(alphonse);
		
		var bernard = new Player("Bernard", 500);
		table.addPlayer(bernard);

		var christophe = new Player("Christophe", 250);
		table.addPlayer(christophe);

		table.preflop();

		var isFolded = false;
		table.on("PlayerFolded", function(player){
			isFolded = true;
			assert.deepEqual(christophe, player);
		});

		assert(!isFolded);
		christophe.fold();
		assert(isFolded);
	});

	it("Doit émettre un événement lorsqu'un joueur pari", function(){
		var table = new Table(1);

		var alphonse = new Player("Alphonse", 1000);
		table.addPlayer(alphonse);
		
		var bernard = new Player("Bernard", 500);
		table.addPlayer(bernard);

		var christophe = new Player("Christophe", 250);
		table.addPlayer(christophe);

		table.preflop();

		table.on("PlayerWaited", function(player){
			player.bet(20);
		});

		table.on("PlayerBet", function(e){
			assert.deepEqual(christophe, e.player);
			assert.equal(christophe.name, e.player.name);
			assert.equal(christophe.stackAmount, 230);
		});

		table.waitCurrentPlayer();
	});

	it("Doit emettre un événement lorsque le nombre minimum de joueur est atteint", function(){
		var table = new Table(1);

		var isReached = false;
		table.on("minPlayerCountReached", function(){
			isReached = true;
		});

		assert(!isReached);
		var alphonse = new Player("Alphonse", 10);
		alphonse.seatTo(table);
		
		assert(!isReached);
		var bernard = new Player("Bernard", 10);
		bernard.seatTo(table);

		assert(isReached);
		var christophe = new Player("Christophe", 10);
		christophe.seatTo(table);

		assert(isReached);
	});

	it.skip("Doit pouvoir jouer une partie", function(){
		var table = new Table(1);

		var alphonse = new Player("Alphonse", 10);
		alphonse.seatTo(table);
		
		var bernard = new Player("Bernard", 10);
		bernard.seatTo(table);

		var christophe = new Player("Christophe", 10);
		christophe.seatTo(table);

		table.distribute();
		table.preflop();

		table.waitCurrentPlayer();
		table.on("PlayerWaited", function(player){
			console.log(player.name + "is waited");
		});


	});

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