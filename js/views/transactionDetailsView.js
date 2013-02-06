App.Views.TransactionDetailsView = Backbone.View.extend({
	model: App.Models.Transaction,
	tagName: 'div',
	className: 'transaction-details cf', 
	template: _.template(
		'date: <input type="date" id="dt_date" class="date" value="<%= entry_date %>" />' + 
		'payee_id: <input type="text" id="dt_payee_id" class="payee_id" value="<%= payee_id %>" />' + 
		'payee: <input type="text" id="dt_payee" class="payee" value="<%= payee %>" />' + 
		//hidden payee_id
		'amount: <input type="number" id="dt_amount" class="amount" value="<%= amount %>" />' + 
		'item: <input type="text" id="dt_item" class="item" value="<%= item %>" />' + 
		'category_id: <input type="text" id="dt_category_id" class="category_id" value="<%= category_id %>" />' + 
		'category: <input type="text" id="dt_category" class="category" value="<%= category %>" />' + 
		'account_id: <input type="text" id="dt_account_id" class="account_id" value="<%= account_id %>" />' + 
		//'<input type="radio" name="account" class="account" value="" />' +
		//hidden account_id
		
		'<button class="save">Save</button>' + 
		//this may need to be hidden if this is a new transaction
		'<button class="delete">Delete</button>' + 
		'<button class="cancel">Cancel</button>'
	),
	events: {
		'click .save': 'saveTransaction',
		'click .cancel': 'cancelTransaction',
		'click .delete': 'deleteTransaction'
	},
	initialize: function(){
		this.model.on('change', this.render, this);
	},
	render: function(){
		var data = this.model.smush();
		this.$el.html(this.template(data));
		//hookup autocomplete fields
		var categoryMap = App.getAutocompleteMap();
		var me = this;
		this.$el.find('input.category').autocomplete({
			source: categoryMap,
			change: function(event,ui){
				App.trace('TransactionDetailsView input.category change() ');
				if (ui.item) {
					//picked an existing category, update model
					me.model.set('category_id', ui.item.id);
				} else {
					//picked a new category, add it
					App.categories.addNew(me.$el.find('input.category').val(), me.categoryAdded, me);
				}
			},
			select: function(event,ui){
				App.trace('TransactionDetailsView input.category select() ' + ui.item.id);
			}
		});
	},
	categoryAdded: function(newModel, me){
		App.trace('TransactionDetailsView.categoryAdded()');
		me.model.set('category_id', newModel.get('id'));
		//this.$el.find('input.category_id').val(model.get('id'));
	},
	saveTransaction: function(){
		var data = {};
			data.id = this.model.get('id');
			data.payee_id = this.$el.find('input.payee_id').val();
			data.payee = this.$el.find('input.payee').val();
			data.entry_date = this.$el.find('input.date').val();
			data.amount = this.$el.find('input.amount').val();
			data.item = this.$el.find('input.item').val();
			data.notes = ''; //@TODO add this field
			data.category_id = this.$el.find('input.category_id').val();
			data.category = this.$el.find('input.category').val();
			data.account_id = this.$el.find('input.account_id').val();
			//account
		App.trace(data);
		this.model.set(data);
		this.model.save({}, {success:function(model){
			App.trace('TransactionDetailsView model-saved isNew=' + model.isNew());
			if (model.isNew()) App.transactions.add(model);
			App.goHome();
		}});
	},
	cancelTransaction: function(){
		if (this.model.isNew()) this.model.destroy();
		App.trace("TransactionDetailsView.cancelTransaction()" + this.model.isNew());
		App.goHome();
	},
	deleteTransaction: function(){
		if (this.model.isNew()) this.cancelTransaction();
		this.model.destroy({success:function(model){
			App.trace("TransactionDetailsView.deleteTransaction()  --existing model destroyed");
			App.goHome();
		}});
	}
});
