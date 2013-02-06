App.Models.Category = Backbone.Model.extend({
	urlRoot: '/api/categories',
	defaults: {"id":null,"category": ""}
});

App.Collections.CategoryList = Backbone.Collection.extend({
	url: '/api/categories',
	model: App.Models.Category,
	initialize: function() {
		App.trace('CategoryList.initialize()');
		this.on('reset', this.resetStatus, this);
	},
	resetStatus: function(){
		App.trace('CategoryList.resetStatus()');
	},
	addNew: function(category, callback, ref){
		App.trace('CategoryList.addNew() ' + this.models.length);
		var model = new App.Models.Category({"category": category});
		var me = this;
		model.save({},{
			success:function(model){
				if (!model.get('dupe')) {
					me.add(model);
					App.trace('Adding new category: ' + me.models.length);
					callback({success:true, model: model, me: ref});
				} else {
					var existingModel = me.get(model.id);
					App.trace('Reusing existing category: ' + me.models.length);
					callback({success:true, model: existingModel, me: ref});
				}
			},
			error:function(e){
				App.trace("New Category Error: " + e);
				callback({me: ref});
			}
		});
	}
});