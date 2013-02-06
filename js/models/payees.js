App.Models.Payee = Backbone.Model.extend({
	defaults: {"id":null,"payee": "","url": "","phone": ""}
});

App.Collections.PayeeList = Backbone.Collection.extend({
	url: '/api/payees',
	model: App.Models.Payee,
	initialize: function() {
		App.trace('PayeeList.initialize()');
		this.on('reset', this.resetStatus, this);
	},
	resetStatus: function(){
		App.trace('PayeeList.resetStatus()');
	}
});