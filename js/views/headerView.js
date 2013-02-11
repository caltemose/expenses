App.Views.HeaderView = Backbone.View.extend({
	model: App.Models.Account, // REMOVE THIS!
	initialize: function(){
		console.dir(this);
		//listen to various global event manager events
		_.bindAll(this, "coreDataLoaded");
		//App.vent.bind("coreDataLoaded", activate);
		

	},
	render: function(){
		var html = '<img class="btn-menu dim" src="assets/img/btn-menu.png" alt="show menu" width="42" height="42" />';
		html += '<img class="btn-add dim" src="assets/img/btn-add.png" alt="add transaction" width="42" height="42" />';
		this.$el.html(html);
	},
	deactivate: function(){
		this.$el.find('img.btn-menu').addClass("dim").unbind('click');
		this.$el.find('img.btn-add').addClass("dim").unbind('click');
	},
	activate: function(){
		var mainMenuClick = this.mainMenuClick;
		var addMenuClick = this.addMenuClick;
		this.$el.find('img.btn-menu').removeClass("dim").bind('click', mainMenuClick);
		this.$el.find('img.btn-add').removeClass("dim").bind('click', addMenuClick);
	},
	mainMenuClick: function(){
		App.trace('HeaderView.mainMenuClick()');
	},
	addMenuClick: function(){
		App.trace('HeaderView.addMenuClick()');
	}
});