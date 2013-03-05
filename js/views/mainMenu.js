App.Views.MainMenu = Backbone.View.extend({
	type: "mainMenu",
	initialize: function(){
	},
	events: {
		'click button': 'handleButton'
	},
	render: function(){
		this.$el.empty();
		var html = '<button data-id="home">Home</button>';
		this.$el.html(html);
	},
	handleButton: function(e){
		var id = $(e.currentTarget).data('id');
		if (id==="home") App.router.navigate("", {trigger:true});
		//@TODO fix route issue
		//if we're on the default route, the menu won't hide since
		//the route never gets updated.
	}
});