App.Views.HeaderView = Backbone.View.extend({
	className: "cf",
	initialize: function(){
		//listen to various global event manager events
		_.bindAll(this, "coreDataLoaded");
		App.vent.bind("coreDataLoaded", this.coreDataLoaded);
	},
	render: function(){
		var html = '<a href="#" class="btn-menu">menu</a>';
		html += '<a href="#" class="btn-add">+</a>';
		this.$el.html(html);
	},
	deactivate: function(){
		App.trace('HeaderView.deactivate()');
		this.$el.find('a.btn-menu').addClass("dim").unbind('click');
		this.$el.find('a.btn-add').addClass("dim").unbind('click');
	},
	activate: function(){
		App.trace('HeaderView.activate()');
		var mainMenuClick = this.mainMenuClick;
		var addMenuClick = this.addMenuClick;
		this.$el.find('a.btn-menu').removeClass("dim").bind('click', mainMenuClick);
		this.$el.find('a.btn-add').removeClass("dim").bind('click', addMenuClick);
	},
	mainMenuClick: function(e){
		e.preventDefault();
		App.trace('HeaderView.mainMenuClick()');
		App.vent.trigger('showMainMenu');
	},
	addMenuClick: function(e){
		e.preventDefault();
		App.trace('HeaderView.addMenuClick()');
		App.vent.trigger('showAddMenu');
	},
	coreDataLoaded: function(){
		this.activate();
	}
});