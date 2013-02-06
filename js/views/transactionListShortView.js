App.Views.TransactionListShortView = Backbone.View.extend({
	tagName: 'ul',
	className: 'transactions short',
	initialize: function(){
    	this.collection.on('add', this.addOne, this);
	    this.collection.on('reset', this.addAll, this);
	},
	events: {
		'click .add': 'addTransaction'
	},
	render: function(){
		this.addAll();
		return this;
	},
	hide: function(){
		this.$el.hide();
	},
	show: function(){
		this.addAll();
		this.$el.show();
	},
	addAll: function(){
		this.$el.empty();
		this.collection.forEach(this.addOne, this);
		var addButton = '<button class="add">Add Transaction</button>';
		this.$el.append(addButton);
	},
	addOne: function(item){
		var me = this;
		var view = new App.Views.TransactionShortView({model: item});
		view.app = this.app;
		view.render();
		this.$el.append(view.el);
	},
	addTransaction: function(){
		App.router.navigate("#transaction/new", {trigger:true});
	}
});
