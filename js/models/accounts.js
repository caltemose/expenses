App.Models.Account = Backbone.Model.extend({
	defaults: {"id":null,"account_name": "","account_number": "","account_type": "","account_institution":""}
});

App.Collections.AccountList = Backbone.Collection.extend({
	url: '/api/accounts',
	model: App.Models.Account,
	initialize: function() {
		App.trace('AccountList.initialize()');
		this.on('reset', this.resetStatus, this);
	},
	resetStatus: function(){
		App.trace('AccountList.resetStatus()');
	}
});