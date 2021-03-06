App.Models.Transaction = Backbone.Model.extend({
	urlRoot: '/api/transactions',
	defaults: {
		"id":null,
		"entry_date": new Date().toISOString().split('T')[0], //date in MYSQL format
		"amount":0,
		"notes":"",
		"account_id": 1,
		"item": "",
		"payee_id": null,
		"category_id": null
	},
	smush: function(){
		var json = this.toJSON();
		json.payee = (this.get('payee_id')) ? App.payees.get(this.get('payee_id')).get('payee') : "";
		json.category = (this.get('category_id')) ? App.categories.get(this.get('category_id')).get('category') : "";
		json.account = (this.get('account_id')) ? App.accounts.get(this.get('account_id')).get('account') : "";
		return json;
	}
});

App.Collections.TransactionList = Backbone.Collection.extend({
	url: '/api/transactions',
	model: App.Models.Transaction,
	
	page: 0,
	perPage: App.userPrefs.perPage,
	total: 0,
	
	comparator: function(trans1, trans2){
		return trans1.get('entry_date') < trans2.get('entry_date');
	},
	parse: function(response){
		this.total = response.total;
		return response.transactions; 
	},
	
	initialize: function() {
		App.trace('TransactionList.initialize()');
		this.on('reset', this.resetStatus, this);
	},
	resetStatus: function(){
		App.trace('TransactionList.resetStatus()');
	}/*,
	fetch: function(options) {
		options || (options = {});
		var data = (options.data || {});
		options.data = {page: this.page, per_page: this.perPage};
		return Backbone.Collection.prototype.fetch.call(this, options);
	}*/
});
