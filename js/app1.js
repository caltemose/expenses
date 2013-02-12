window.App = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},

	//main router and events
	router: {},
	vent: {},
	
	//data
	payees: {},
	categories: {},
	accounts: {},
	transactions: {},
	
	//permanent views
	headerView: {},
	//mainView: null,
	//mainDetailsView: null,
	
	init: function(){
		this.trace('App.init()');
		$('#content').html('<div class="startup">Starting up...</div>');
		
		//event manager
		App.vent = _.extend({}, Backbone.Events);
		
		//init headerView
		headerView = new App.Views.HeaderView();
		headerView.render();
		$('#header').append(headerView.el);
		
		//load core data
		this.payees = new App.Collections.PayeeList();
		this.accounts = new App.Collections.AccountList();
		this.categories = new App.Collections.CategoryList();

		this.payees.fetch({success:function(){
			App.accounts.fetch({success:function(){
				App.categories.fetch({success:function(){
					App.vent.trigger('coreDataLoaded');
				}});
			}});
		}});

	},
	trace: function(msg){
		console.log(msg);
	}
};

$(function(){
	App.init();
});
