var PayeeItem = Backbone.Model.extend({
	defaults: {"id":null,"payee": "","url": "","phone": ""}
});
var PayeeList = Backbone.Collection.extend({
	url: '/api/payees',
	model: PayeeItem
});

var TransactionItem = Backbone.Model.extend({});
var TransactionList = Backbone.Collection.extend({
	url: '/api/transactions',
	model: TransactionItem,
	payees: PayeeList,
	initialize: function(){
		this.on('reset', this.doReset, this);
	},
	doReset: function(){
		//update relations
		console.log(this.payees.where({id:"1"})[0].toJSON());
		//this.collection.forEach(this.addOne, this);
	}
});

var TransactionView = Backbone.View.extend({
	tagName: '<ul>',
	template: _.template(
		'<li><%= entry_date %></li>' +
		'<li><%= item %></li>' + 
		'<li><%= payee_id %></li>' +
		'<li><%= payee %></li>'
		),
	initialize: function(){
		this.model.on('change reset', this.render, this);
	},
	render: function(){
		//this.updateRelations();
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	updateRelations: function(){
		//console.log('TransactionView.updateRelations()');
	}
});

var TransactionsView = Backbone.View.extend({
	el: $('#app'),
	initialize: function(){
		this.collection.on('reset', this.addAll, this);
	},
	render: function(){
		this.addAll();
		return this;
	},
	addAll: function(){
		this.$el.empty();
		this.collection.forEach(this.addOne, this);
	},
	addOne: function(item){
		var transactionView = new TransactionView({model:item});
		this.$el.append(transactionView.render().el);
	}
});
$(function(){
	var payees = new PayeeList();
	var transactions = new TransactionList();
	//var transactionsView = new TransactionsView({collection: transactions});
	payees.fetch({success: function(){
		transactions.payees = payees;
		transactions.fetch();
	}});
});

/*
var PayeeView = Backbone.View.extend({
	template: _.template(
		'<input class="id" type="text" id="id_<%= id %>" size="3" value="<%= id %>" disabled />' + 
		'<input class="payee" type="text" id="payee_<%= id %>" value="<%= payee %>" required /> ' + 
		'<input class="url" type="text" id="url_<%= id %>" value="<%= url %>" /> ' +
		'<input class="phone" type="text" id="phone_<%= id %>" value="<%= phone %>" /> ' + 
		'<button class="save">save</button>' +
		'<button class="delete">delete</button>'
	),
	initialize: function(){
		this.model.on('change', this.render, this);
		this.model.on('destroy hide', this.remove, this);
	},
	events: {
		'click .save': 'savePayee',
		'click .delete': 'deletePayee'
	},
	savePayee: function(event) {
		var data = {};
			data.payee = this.$el.find('input.payee').val();
			data.url = this.$el.find('input.url').val();
			data.phone = this.$el.find('input.phone').val();
		this.model.set(data);
		this.model.save();
	},
	deletePayee: function(event) {
		//delete model
		this.model.destroy();
	},
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	remove: function(){
		this.$el.remove();
	}
});
*/
/*
var PayeesView = Backbone.View.extend({
	el: $('#app'),
	initialize: function(){
		this.collection.on('reset', this.addAll, this);
		this.collection.on('add', this.addOne, this);
	},
	render: function(){
		this.addAll();
		return this;
	},
	addAll: function(){
		var button = this.$el.find('button.add');
		if (button) $(button).unbind('click');
    	this.$el.empty();
    	this.$el.append('<button class="add">Add One</button>');
    	button = this.$el.find('button.add');
    	var me = this;
    	$(button).click(function(){me.addPayee();});
    	this.collection.forEach(this.addOne, this);
  	},
	addOne: function(item){
		var payeeView = new PayeeView({model: item});
		this.$el.append(payeeView.render().el);
	},
	addPayee: function(event){
		this.collection.add(new PayeeItem());
	}
});
$(function(){
	var payees = new PayeeList();
	var payeesView = new PayeesView({collection: payees});
	payees.fetch();
});
*/