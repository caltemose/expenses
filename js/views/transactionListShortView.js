App.Views.TransactionListShortView = Backbone.View.extend({
	//tagName: 'ul',
	className: 'transactions-container',
	initialize: function(){
    	this.collection.on('add', this.addOne, this);
	    this.collection.on('reset', this.addAll, this);
	},
	events: {
		'click .page-button.prev': 'pagePrev',
		'click .page-button.next': 'pageNext'
	},
	render: function(){
		this.$el.empty();
		this.$el.html('<ul class="transactions short"></ul>');
		this.addAll();
		var pagination = '<div class="pagination cf"><div class="page-button prev cf"><a href="#" class="page-prev">&laquo;</a></div>';
		pagination += '<div class="page-button next"><a href="#" class="page-next">&raquo;</a></div></div>';
		this.$el.append(pagination);
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
		this.collection.forEach(this.addOne, this);
	},
	addOne: function(item){
		var me = this;
		var view = new App.Views.TransactionShortView({model: item});
		// @TODO remove this
		view.app = this.app;
		view.render();
		this.$el.find('ul').append(view.el);
	},
	pagePrev: function(e){
		e.preventDefault();
		App.trace('pagePrev');
	},
	pageNext: function(e){
		e.preventDefault();
		App.trace('pageNext');
	}
});
