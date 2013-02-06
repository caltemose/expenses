App.Views.TransactionShortView = Backbone.View.extend({
	model: App.Models.Transaction,
	tagName: 'li',
	/* will append account class for different bgcolor per account */
	className: 'transaction cf', 
	template: _.template(
		'<div class="payee"><%= payee %></div>' + 
		'<div class="amount"><%= amount %></div>'
	),
	events: {
		'click': 'showTransactionDetail'
	},
	initialize: function(){
		//there probably won't be model events to listen to in this view
	},
	render: function(){
		this.$el.html(this.template(this.model.smush()));
	},
	showTransactionDetail: function(){
		App.trace('TransactionShortView.showTransactionDetail()');
		//this.parent.showTransactionDetails( this.model.get('id') );
		//App.showTransactionDetails( this.model.get('id') );
		App.router.navigate("#transaction/" + this.model.get('id'), {trigger:true});
	}
});
