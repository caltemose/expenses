window.App = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
	
	vent: {},
	
	router: {},
	payees: {},
	categories: {},
	accounts: {},
	transactions: {},
	
	headerView: {},
	//mainView: null,
	//mainDetailsView: null,
	
	init: function(){
		this.trace('App.init()');
		$('#app').html('<div class="startup">Starting up...</div>');
		
		//event manager
		this.vent = _.extend({}, Backbone.Events);
		
		//init headerView
		headerView = new App.Views.HeaderView();
		headerView.render();
		$('#header').html(headerView.el);
		
		/*
		//load core data
		this.payees = new App.Collections.PayeeList();
		this.accounts = new App.Collections.AccountList();
		this.categories = new App.Collections.CategoryList();

		this.payees.fetch({success:function(){
			App.accounts.fetch({success:function(){
				App.categories.fetch({success:function(){
					//App.vent.trigger('coreDataLoaded');
				}});
			}});
		}});
		*/

	},
	trace: function(msg){
		console.log(msg);
	}
};

$(function(){
	App.init();
});