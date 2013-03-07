App.Views.TransactionListShortView = Backbone.View.extend({
	//tagName: 'ul',
	className: 'transactions-container',
	initialize: function(){
    	this.collection.on('add', this.addOne, this);
	    this.collection.on('reset', this.redraw, this);
	},
	events: {
		//'click .page-button.prev': 'pagePrev',
		//'click .page-button.next': 'pageNext'
	},
	render: function(){
		this.$el.empty();
		this.$el.html('<ul class="transactions short"></ul>');
		this.addAll();
		var next = parseInt(this.collection.page)+1, 
			prev = parseInt(this.collection.page)-1,
			pp = parseInt(this.collection.perPage),
			total = parseInt(this.collection.total),
			totalPages = Math.ceil(total/pp),
			nextLink, prevLink;
		
		//@TODO clean this up including making the entire button active instead of the <a>
		if (prev>=0) {
			prevLink = '<a href="app1.html#transactions/p' + prev + '/pp' + pp + '" ';
			prevLink+= 'class="page-prev">&laquo;</a>';
		} else
			prevLink = '<a class="page-prev dim">&laquo;</a>';
		
		if (totalPages > next) {
			nextLink = '<a href="app1.html#transactions/p' + next + '/pp' + pp + '" ';
			nextLink+= 'class="page-next">&raquo;</a>';
		} else
			nextLink = '<a class="page-next dim">&raquo;</a>';
		
		var pagination = '<div class="pagination cf">';
		pagination += '<div class="page-button prev';
		if (prev<0) pagination += ' dim ';
		pagination += ' prev cf">' + prevLink + '</div>';
		pagination += '<div class="page-button next';
		if (totalPages <= next) pagination += ' dim ';
		pagination += '">' + nextLink + '</div></div>';
		this.$el.append(pagination);
		return this;
	},
	redraw: function(){
		App.trace('TransactionListShortView.redraw()');
		App.trace('page: ' + this.collection.page + ', per_page: ' + this.collection.perPage);
		this.render();
	},
	hide: function(){
		this.$el.hide();
	},
	show: function(){
		this.addAll();
		this.$el.show();
	},
	addAll: function(){
		//this.collection.forEach(this.addOne, this);
		var i, modl, date, html = "";
		for(i=0; i<this.collection.length; i++){
			modl = this.collection.at(i);
			if(modl.get('entry_date') != date) {
				this.$el.find('ul').append('<li class="date">' + modl.get('entry_date') + '</li>');
			}
			this.addOne(modl);
			date = modl.get('entry_date');
		}
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
		var path = '/transactions/p' + (this.collection.page+1) + "/pp" + this.collection.perPage;
		App.router.navigate(path,{trigger:true});
	}
});
