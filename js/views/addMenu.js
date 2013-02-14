App.Views.AddMenu = Backbone.View.extend({
	accounts: null,
	initialize: function(options){
		this.accounts = options.accounts;
	},
	events: {
		'click .account': 'newTransaction'
	},
	render: function(){
		this.addAccounts();
		this.addShortcuts();
		return this;
	},
	addAccounts: function(){
		this.$el.empty();
		this.accounts.forEach(this.addAccount, this);
	},
	addAccount: function(acct){
		App.trace('addAccount: ' + acct.get('account_name'));
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
		_.each(App.shortcuts, function(el, indx, list) {
			btn = '<button class="shortcut" data-index="' + indx + '">';
			btn += el.label + '</button>';
		});
	},
	newTransaction: function(e){
		var id = $(e.currentTarget).data('id');
		App.router.navigate("#newTransaction/account/" + id, {trigger:true});
	}
});