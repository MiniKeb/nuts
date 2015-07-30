var CommandBus = function(){
	this._handlers = {};
};
CommandBus.prototype = {
	addHandler: function(commandName, commandHandler){
		this._handlers[commandName] = commandHandler;
		return this;
	},

	execute: function(command){
		this._handlers[command.name].execute(command);
	}
}

var EventBus = function(){
	this._handlers = {};
};
EventBus.prototype = {
	addHandler: function(eventName, eventHandler){
		if(this._handlers[eventName] == undefined)
			this._handlers[eventName] = [];

		this._handlers[eventName].push(eventHandler);

		return this;
	},

	dispatch: function(event){
		for(var i = 0; i < this._handlers[event.name]; i++)
		{
			this._handlers[event.name][i].trigger(event);
		}
	}
}

module.exports.Command = CommandBus;
module.exports.Event = EventBus;