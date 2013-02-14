window.App = {
	Models: {}, Collections: {}, Views: {}, Routers: {},

	//DOM elements jQuery-ified
	els: {
		$content: $('#content'),
		$header: $('#header'),
		$menu: $('#menu')
	},

	//main router and events aggregator
	router: {},
	vent: {},
	
	//data
	payees: null,
	categories: null,
	accounts: null,
	transactions: null,
	
	//stored views
	headerView: null,
	mainListView: null,
	detailsView: null,
	
	init: function(){
		this.trace('App.init()');
		this.els.$content.html('<div class="startup">Starting up...</div>');
		
		//event manager
		App.vent = _.extend({}, Backbone.Events);
		//events main App listens to
		_.bindAll(this, "routeIndex");
		App.vent.bind("routeIndex", this.routeIndex);
		_.bindAll(this, "routeTransactionShortView");
		App.vent.bind("routeTransactionShortView", this.routeTransactionShortView);
		
		//init headerView
		headerView = new App.Views.HeaderView();
		headerView.render();
		this.els.$header.append(headerView.el);
		
		//create core data collections
		this.payees = new App.Collections.PayeeList();
		this.accounts = new App.Collections.AccountList();
		this.categories = new App.Collections.CategoryList();
		//and load data using successive callbacks
		this.payees.fetch({success:function(){
			App.accounts.fetch({success:function(){
				App.categories.fetch({success:function(){
					//dispatch data load success event
					App.vent.trigger('coreDataLoaded');
					//create and start the router to handle the initial URL
					App.router = new App.Routers.Router();
					App.router.start();
				}});
			}});
		}});

	},
	trace: function(msg){
		console.log(msg);
	},
	/*
	 *
	 *  routing functions
	 *
	 */
	routeIndex: function(){
		this.trace('App.routeIndex()');
		if (!this.transactions){
			//load recent transactions
			this.trace('App load recent transactions');
			this.transactions = new App.Collections.TransactionList();
			this.transactions.fetch();
		}
		if (!this.mainListView) {
			//create mainListView of transaction summaries
			this.mainListView = new App.Views.TransactionListShortView({collection: this.transactions});
			this.mainListView.render();
			this.els.$content.empty();
			this.els.$content.html(this.mainListView.el);
		}
	},
	routeTransactionShortView: function(id){
		this.trace('App.routeTransactionShortView()');
		if (!this.transactions) {
			//load this transaction
			var transaction = new App.Models.Transaction({id: id});
			transaction.fetch({success:function(trans){
				App.trace('transaction loaded: ' + trans.get('id'));
			}});
		} else if (!this.transactions.get(id)){
			//load this transaction
			var transaction = new App.Models.Transaction({id: id});
			transaction.fetch();
			transaction.fetch({success:function(trans){
				App.trace('transaction loaded: ' + trans.get('id'));
			}});
		} else {
			//display this transaction
			var transaction = this.transactions.get(id);
			this.detailsView = new App.Views.TransactionDetailsView({model:transaction});
			this.detailsView.render();
			this.els.$content.empty();
			this.els.$content.html(this.detailsView.el);
		}
	},
	/*
	 *
	 *  data helper functions
	 *
	 */
	getCategoryAutocompleteMap: function(){
		var map = [];
		App.categories.each(function(model){
			map.push({
				value: model.get('category'),
				id: model.get('id')
			});
		});
		return map;
	},
	getPayeeAutocompleteMap: function(){
		var map = [];
		App.payees.each(function(model){
			map.push({
				value: model.get('payee'),
				id: model.get('id')
			});
		});
		return map;
	}
};

$(function(){
	App.init();
});
