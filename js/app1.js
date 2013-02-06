window.App = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
	
	router: {},
	payees: {},
	categories: {},
	accounts: {},
	transactions: {},
	
	mainView: null,
	mainDetailsView: null,
	
	init: function(){
		this.trace('App.init()');
		//create the necessary collections
		this.payees = new App.Collections.PayeeList();
		this.accounts = new App.Collections.AccountList();
		this.categories = new App.Collections.CategoryList();
		this.transactions = new App.Collections.TransactionList(); 
		$('#menu').hide();
		//and start sequentially loading them
		this.payees.fetch({success:function(){
			App.accounts.fetch({success:function(){
				App.categories.fetch({success:function(){
					App.transactions.fetch({success:function(){
						App.trace(App.accounts.toJSON());
						App.trace(App.categories.toJSON());
						App.trace(App.payees.toJSON());
						App.trace(App.transactions.toJSON());
						
						App.activateHeader();
						
						App.router = new App.Routers.Router();
						App.router.start();
						//App.router.navigate("",true);
					}});
				}});
			}});
		}});
	},
	activateHeader: function(){
		var me = this;
		$('#header a.btn-menu').click(function(){
			me.toggleMenu();
		});
		$('#header a.btn-add').click(function(){
			me.toggleAddMenu();
		});
	},
	toggleMenu: function(){
		App.trace('App.toggleMenu()');
	},
	toggleAddMenu: function(){
		App.trace('App.toggleAddMenu()');
		if ($('#menu').is(":visible") {
			//empty + hide it
		} else {
			//puplate + show it
			$('#menu').show();
		}
	},
	createTransactionView: function(){
		App.trace('App.createTransactionView()');
		App.mainView = new App.Views.TransactionListShortView({collection: App.transactions});
		App.mainView.app = App;
		App.mainView.render();
		$('#app').empty();
		$('#app').html(App.mainView.el);
	},
	createTransactionDetailsView: function(id){
		App.trace('App.createTransactionDetailsView()');
		var transaction = App.transactions.get(id);
		App.mainDetailsView = new App.Views.TransactionDetailsView({model: transaction});
		App.mainDetailsView.render();
		$('#app').empty();
		$('#app').html(App.mainDetailsView.el);
	},
	trace: function(msg){
		console.log(msg);
	},
	//ui event functions
	showTransactionDetails: function(id){
		App.trace('App.showTransactionDetails() :: ' + id);
		if (App.mainView) App.mainView.remove();
		App.createTransactionDetailsView(id);
	},
	removeTransactionDetails: function(id){
		App.trace('App.removeTransactionDetails() :: ' + id);
		if (App.mainView) App.mainDetailsView.remove();
		App.mainDetailsView = null;
		App.createTransactionView();
	},
	createNewTransaction: function(){
		App.trace('App.createNewTransaction()');
		if (App.mainView) App.mainView.remove();
		var transaction = new App.Models.Transaction();
		//add account here from submenu?
		//add model to collection here or after save?
		App.mainDetailsView = new App.Views.TransactionDetailsView({model: transaction});
		App.mainDetailsView.render();
		$('#app').empty();
		$('#app').append(App.mainDetailsView.el);
	},
	
	goHome: function(){
		App.router.navigate("",{trigger:true});
	},
	
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