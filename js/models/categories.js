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
		model.save({},{success:function(model){
			me.add(model);
			App.trace('new length: ' + me.models.length);
			callback(model, ref);
		}});
		//model.sync();
		//this.add(model);
		//this.sync();
		//callback();
	}
});