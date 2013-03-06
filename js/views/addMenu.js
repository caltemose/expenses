App.Views.AddMenu = Backbone.View.extend({
	type: "addMenu",
	accounts: null,
	initialize: function(options){
		this.accounts = options.accounts;
	},
	events: {
		'click .account': 'newTransaction',
		'click .shortcut': 'handleShortcut'
	},
	render: function(){
		this.$el.empty();
		this.addAccounts();
		this.addShortcuts();
		App.els.$menu.css('height', $('html').height());
		return this;
	},
	addAccounts: function(){
		this.accounts.forEach(this.addAccount, this);
	},
	addAccount: function(acct){
		//App.trace('addAccount: ' + acct.get('account_name'));
		var btn = '<button class="account" data-id="' + acct.get('id') + '">';
		btn += acct.get('account_name') + '</button>';
		this.$el.append(btn);
	},
	addShortcuts: function(){
		/*
			account_id, category_id, payee_id, item, amount
			
			known: account_id, category_id, payee_id, item
			instant ATM transaction
			groceries
			auto gas
			
			monthly bills: gas, power, water
			
			all that + consistent price:
			t-mobile, comcast
		*/
		// CHANGE THIS TO CREATE VIEWS w/MODELS
		var btn;
		var $el = this.$el;
		_.each(App.shortcuts, function(el, indx, list) {
			btn = '<button class="shortcut" data-id="' + indx + '">';
			btn += el.label + '</button>';
			$el.append(btn);
		});
	},
	newTransaction: function(e){
		var id = $(e.currentTarget).data('id');
		App.router.navigate("#newTransaction/account/" + id, {trigger:true});
	},
	handleShortcut: function(e){
		var id = $(e.currentTarget).data('id');
		App.router.navigate("#newTransaction/shortcut/" + id, {trigger:true});
	}
});