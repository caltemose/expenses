App.Views.TransactionShortView = Backbone.View.extend({
	model: App.Models.Transaction,
	tagName: 'li',
	// @TODO append account class for different bgcolor per account
	className: 'transaction cf', 
	template: _.template(
		'<div class="payee"><%= payee %></div>' + 
		'<div class="amount"><%= amount %></div>'
	),
	events: {
		'click': 'showTransactionDetail'
	},
	initialize: function(){
		// @TODO what events does this need to listen to?
	},
	render: function(){
		this.$el.html(this.template(this.model.smush()));
	},
	showTransactionDetail: function(){
		App.trace('TransactionShortView.showTransactionDetail()');
		App.router.navigate("#transaction/" + this.model.get('id'), {trigger:true});
		//App.vent.trigger("routeTransactionShortView", this.model);
	}
});
