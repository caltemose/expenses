App.Routers.Router = Backbone.Router.extend({
	routes: {
		"": "index",
		"transaction/:id": "transactionDetails",
		"newTransaction/:mode/:value": "transactionDetailsCustom"
	},
	initialize: function(options){
		App.trace("Router.initialize()");
	},
	start: function(){
		App.trace("Router.start()");
		Backbone.history.start({pushState: false});
	},
	index: function(){
		App.trace("Router.index()");
		App.vent.trigger("routeIndex");
	},
	transactionDetails: function(id){
		App.trace("Router.transactionDetails(" + id + ")");
		//if (id==="new") App.createNewTransaction();
		//else App.showTransactionDetails(id);
		App.vent.trigger('routeTransactionShortView', id);
	},
	transactionDetailsCustom: function(mode, value){
		App.trace("Router.transactionDetailsCustom(" + mode + ', ' + value + ')');
		App.newTransactionCustom(mode, value);
	}
});