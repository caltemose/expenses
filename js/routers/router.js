App.Routers.Router = Backbone.Router.extend({
	routes: {
		"": "index",
		"transaction/:id": "transactionDetails"
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
		App.createTransactionView();
	},
	transactionDetails: function(id){
		App.trace("Router.transactionDetails(" + id + ")");
		if (id==="new") App.createNewTransaction();
		else App.showTransactionDetails(id);
	}
});