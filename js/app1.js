window.App = {
	Models: {}, Collections: {}, Views: {}, Routers: {},

	// @TODO enable debug/live modes via url parameters ?debug=true (false by default)
	debug: true, 

	// @TODO Add a global database structural definition for models to reference
	// @TODO Integrate external templates properly

	//DOM elements jQuery-ified
	els: {
		$content: $('#content'),
		$header: $('#header'),
		$menu: $('#menu')
	},

	//main router and events aggregator
	router: {},
	vent: {},
	
	//stored data
	payees: null,
	categories: null,
	accounts: null,
	transactions: null,
	
	shortcuts: [
		//Checking, Cash, ATM
		{label: "Get Cash", account_id: "1", payee_id: "15", category_id: "1", item: "Cash"},
		//Credit, Whole Foods, Groceries
		{label: "Groceries - WF", account_id: "2", payee_id: "16", category_id: "4", item: "Groceries"}
	],
	
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
		// @TODO condense this nonsense
		_.bindAll(this, "routeIndex");
		App.vent.bind("routeIndex", this.routeIndex);
		_.bindAll(this, "routeTransactionShortView");
		App.vent.bind("routeTransactionShortView", this.routeTransactionShortView);
		_.bindAll(this, "showAddMenu");
		App.vent.bind("showAddMenu", this.showAddMenu);
		_.bindAll(this, "showAddMenu");
		
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
		if (App.debug) console.log(msg);
	},
	/*
	 *
	 *  routing functions
	 *
	 */
	routeIndex: function(){
		if (!this.transactions){
			//load recent transactions
			this.transactions = new App.Collections.TransactionList();
			this.transactions.fetch();
		}
		if (!this.mainListView) this.createMainListView();
	},
	routeTransactionShortView: function(id){
		if (this.mainListView) this.destroyMainListView();
		if (!this.transactions) {
			//load this transaction
			var transaction = new App.Models.Transaction({id: id});
			transaction.fetch({success:function(trans){
				App.createDetailsView(trans);
			}});
		} else if (!this.transactions.get(id)){
			//load this transaction
			var transaction = new App.Models.Transaction({id: id});
			transaction.fetch({success:function(trans){
				App.createDetailsView(trans);
			}});
		} else {
			//display this transaction
			var transaction = this.transactions.get(id);
			this.createDetailsView(transaction);
		}
	},
	newTransactionCustom: function(mode, value){
		App.trace('App.newTransactionCustom() ' + mode);
		if (mode==="account") {
			var transaction = new App.Models.Transaction();
			transaction.set({"account_id": value});
		}
		this.destroyMenu();
		this.destroyMainListView();
		this.createDetailsView(transaction);
	},
	/*
	 *
	 * menu management functions
	 *
	 */
	showMainMenu: function(){
		
	},
	showAddMenu: function(){
		this.menu = new App.Views.AddMenu({accounts: this.accounts});
		this.menu.render();
		this.els.$menu.html(this.menu.el).show();
	},
	destroyMenu: function(){
		if (this.menu) {
			this.menu.remove();
			this.menu.unbind();
			this.els.$menu.empty().hide();
			this.menu = null;
		}
	},
	/*
	 *
	 * view management functions
	 *
	 */
	createMainListView: function(){
		//create mainListView of transaction summaries
		this.mainListView = new App.Views.TransactionListShortView({collection: this.transactions});
		this.mainListView.render();
		this.els.$content.empty();
		this.els.$content.html(this.mainListView.el);
	},
	destroyMainListView: function(){
		if (this.mainListView) {
			this.mainListView.remove();
			this.mainListView.unbind();
			this.els.$content.empty();
			this.mainListView = null;
		}
	},
	createDetailsView: function(model){
		this.detailsView = new App.Views.TransactionDetailsView({model:model});
		this.detailsView.render();
		this.els.$content.empty();
		this.els.$content.html(this.detailsView.el);
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
