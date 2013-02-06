App.Models.Payee = Backbone.Model.extend({
	urlRoot: '/api/payees',
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
	},
	addNew: function(payee, callback, ref){
		App.trace('PayeeList.addNew() ' + this.models.length);
		var model = new App.Models.Payee({"payee": payee});
		var me = this;
		model.save({},{
			success:function(model){
				if (!model.get('dupe')) {
					me.add(model);
					App.trace('Adding new payee: ' + me.models.length);
					callback({success:true, model: model, me: ref});
				} else {
					var existingModel = me.get(model.id);
					App.trace('Reusing existing payee: ' + me.models.length);
					callback({success:true, model: existingModel, me: ref});
				}
			},
			error:function(e){
				App.trace("New Payee Error: " + e);
				callback({me: ref});
			}
		});
	}
});