App.Views.TransactionDetailsView = Backbone.View.extend({
	model: App.Models.Transaction,
	tagName: 'div',
	className: 'transaction-details cf', 
	template: _.template(
		'<div><label for="dt_date">date</label>' +
		'<input type="date" id="dt_date" class="date" value="<%= entry_date %>" /></div>' + 

		'<div><label for="dt_amount">amount</label>' +
		'<input type="number" id="dt_amount" class="amount" value="<%= amount %>" /></div>' + 
		
		'<input type="hidden" id="dt_payee_id" class="payee_id" value="<%= payee_id %>" />' + 
		'<div><label for="dt_payee">payee</label>' +
		'<input type="text" id="dt_payee" class="payee" value="<%= payee %>" /></div>' + 

		'<div><label for="dt_item">item</label>' +
		'<input type="text" id="dt_item" class="item" value="<%= item %>" /></div>' + 

		'<input type="hidden" id="dt_category_id" class="category_id" value="<%= category_id %>" />' + 
		'<div><label for="dt_category">category</label>' +
		'<input type="text" id="dt_category" class="category" value="<%= category %>" /></div>' + 

		'<input type="hidden" id="dt_account_id" class="account_id" value="<%= account_id %>" />' + 
		'<div><span id="accounts"></span></div>' +
		
		'<div><label>Notes</label><br/><textarea class="notes"><%= notes %></textarea></div>' +
		
		'<button class="save">Save</button>' + 
		//this could/should be hidden if this is a new transaction
		'<button class="delete">Delete</button>' + 
		'<button class="cancel">Cancel</button>'
	),
	events: {
		'click .save': 'saveTransaction',
		'click .cancel': 'cancelTransaction',
		'click .delete': 'deleteTransaction'
	},
	initialize: function(){
		//this.model.on('change', this.render, this);
	},
	render: function(){
		App.trace(this.model.get('account_id'));
		var data = this.model.smush(),
			me = this,
			categoryMap = App.getCategoryAutocompleteMap(),
			payeeMap = App.getPayeeAutocompleteMap(),
			html = '',
			i, model;
			
		this.$el.html(this.template(data));
		//add accounts radio buttons
		for(i=0;i<App.accounts.length;i++){
			model = App.accounts.at(i);
			html += '<input type="radio" class="account-radio" name="account" id="account_';
			html += model.get('id') + '" ';
			html += 'value="' + model.get('account_name') + '" ';
			html += 'data-id="' + model.get('id') + '" ';
			if (model.get('id') === this.model.get('account_id')) html += ' checked ';
			html += '/>';
			html += '<label for="account_' + model.get('id') + '">' + model.get('account_name') + '</label>';
		}
		this.$el.find('span#accounts').html(html);
		this.$el.find('input.account-radio').change(function(){
			me.model.set({account_id: $(this).data('id')}, {silent:true});
			me.$el.find('input.account_id').val( $(this).data('id') );
		});
		
		//hookup category autocomplete fields
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
				if (ui.item) {
					//picked an existing category, update model
					me.model.set('category_id', ui.item.id);
				} else {
					//picked a new category, add it
					App.categories.addNew(me.$el.find('input.category').val(), me.categoryAdded, me);
				}
			}
		});
		//hookup payee autocomplete fields
		this.$el.find('input.payee').autocomplete({
			source: payeeMap,
			change: function(event,ui){
				App.trace('TransactionDetailsView input.payee change() ');
				if (ui.item) {
					//picked an existing category, update model
					me.model.set('payee_id', ui.item.id);
				} else {
					//picked a new category, add it
					App.payees.addNew(me.$el.find('input.payee').val(), me.payeeAdded, me);
				}
			},
			select: function(event,ui){
				App.trace('TransactionDetailsView input.payee select() ' + ui.item.id);
				if (ui.item) {
					//picked an existing category, update model
					me.model.set('payee_id', ui.item.id);
				} else {
					//picked a new category, add it
					App.payees.addNew(me.$el.find('input.payee').val(), me.payeeAdded, me);
				}
			}
		});
		
	},
	categoryAdded: function(results){
		App.trace('TransactionDetailsView.categoryAdded()');
		if (results.success) results.me.model.set('category_id', results.model.get('id'));
		else alert("Category Add failed");
	},
	payeeAdded: function(results){
		App.trace('TransactionDetailsView.payeeAdded()');
		if (results.success) results.me.model.set('payee_id', results.model.get('id'));
		else alert("Payee Add failed");
	},
	saveTransaction: function(){
		App.trace(this.$el.find('input.category_id').val());
		var data = {};
			data.id = this.model.get('id');
			data.payee_id = this.model.get('payee_id'); //this.$el.find('input.payee_id').val();
			data.payee = this.$el.find('input.payee').val();
			data.entry_date = this.$el.find('input.date').val();
			data.amount = this.$el.find('input.amount').val();
			data.item = this.$el.find('input.item').val();
			data.notes = this.$el.find('textarea.notes').val();
			data.category_id = this.model.get('category_id'); //this.$el.find('input.category_id').val();
			data.category = this.$el.find('input.category').val();
			data.account_id = this.model.get('account_id'); //this.$el.find('input.account_id').val();
			//account
		var isNew = this.model.isNew();
		this.model.set(data);
		//@TODO add error handling
		this.model.save({}, {success:function(model){
			App.trace('TransactionDetailsView model-saved isNew=' + isNew);
			if (isNew) App.transactions.add(model);
			App.router.navigate("",{trigger:true});
		}});
	},
	cancelTransaction: function(){
		if (this.model.isNew()) this.model.destroy();
		App.trace("TransactionDetailsView.cancelTransaction()" + this.model.isNew());
		App.router.navigate("",{trigger:true});
	},
	deleteTransaction: function(){
		if (this.model.isNew()) this.cancelTransaction();
		//@TODO add error handling
		this.model.destroy({success:function(model){
			App.trace("TransactionDetailsView.deleteTransaction()  --existing model destroyed");
			App.router.navigate("",{trigger:true});
		}});
	}
});
