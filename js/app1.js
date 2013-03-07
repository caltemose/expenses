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
		$menu: $('#menu'),
		$msg: $('#msg')
	},

	userPrefs: {
		perPage: 4
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
		{label: "Get Cash", account_id: "1", payee_id: "13", category_id: "46", item: "Cash"},
		//Credit, Whole Foods, Groceries
		{label: "Groceries - WF", account_id: "2", payee_id: "70", category_id: "17", item: "Groceries"},
		//Checking, Dekalb Farmers Market, Groceries
		{label: "Groceries - DKFM", account_id: "1", payee_id: "19", category_id: "17", item: "Groceries"},
		//Credit, Lowe's
		{label: "Lowe's", account_id: "2", payee_id: "37", category_id: "20", item: "Item"},
		//monthly
		{label: "USAA Insurance", account_id: "1", payee_id: "75", category_id: "45", item: "Home and Auto Insurance"},
		{label: "Gas Bill", account_id: "1", payee_id: "27", category_id: "40", item: "Gas Bill"},
		{label: "Power Bill", account_id: "1", payee_id: "28", category_id: "42", item: "Power Bill"},
		{label: "Ackerman", account_id: "2", payee_id: "73", category_id: "41", item: "Security Bill"}
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
		_.bindAll(this, "showMainMenu");
		App.vent.bind("showMainMenu", this.showMainMenu);
		
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
	routeIndex: function(page, perPage){
		if (!this.transactions){
			console.log('index page');
			//load recent transactions
			this.transactions = new App.Collections.TransactionList();
			this.transactions.page = page;
			this.transactions.perPage = perPage;
			this.transactions.fetch({data:{page:page,per_page:perPage}});
		} else {
			//handle when transactions are loaded and need to be reloaded
			//by comparing arguments to collection props
			if (page === this.transactions.page) console.log('same page');
			else console.log('different page');
			this.transactions.page = page;
			this.transactions.perPage = perPage;
			this.transactions.fetch({data:{page:page,per_page:perPage}});
		}
		if (!this.mainListView) this.createMainListView();
		this.destroyMenu();
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
		var transaction;
		if (mode==="account") {
			transaction = new App.Models.Transaction();
			transaction.set({"account_id": value});
		} else if (mode==="shortcut") {
			transaction = new App.Models.Transaction();
			var shortcut = App.shortcuts[value];
			transaction.set({"account_id":shortcut.account_id});
			transaction.set({"payee_id": shortcut.payee_id});
			transaction.set({"category_id": shortcut.category_id});
			transaction.set({"item": shortcut.item});
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
		var makeMenu = true;
		if (this.menu) {
			if (this.menu.type === "mainMenu") makeMenu = false;
			this.destroyMenu();
		}
		if (makeMenu) {
			this.menu = new App.Views.MainMenu();
			this.menu.render();
			this.els.$menu.html(this.menu.el).show();
			this.adjustMenu();
		}
	},
	showAddMenu: function(){
		var makeMenu = true;
		if (this.menu) {
			if (this.menu.type === "addMenu") makeMenu = false;
			this.destroyMenu();
		}
		if (makeMenu) {
			this.menu = new App.Views.AddMenu({accounts: this.accounts});
			this.menu.render();
			this.els.$menu.html(this.menu.el).show();
			this.adjustMenu();
		}
	},
	destroyMenu: function(){
		if (this.menu) {
			this.menu.remove();
			this.menu.unbind();
			this.els.$menu.empty().hide();
			this.menu = null;
		}
	},
	adjustMenu: function(){
		var h = $(window).height();
		this.els.$menu.css('height', h);
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
	loadMsg: function(){
		var html = '<img class="loading" src="assets/img/loading.gif" alt="loading..." />';
		this.els.$msg.html(html);
		this.els.$msg.show();
		this.els.$msg.find('img.loading').center();
	},
	killMsg: function(){
		this.els.$msg.hide();
		this.els.$msg.empty();
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
