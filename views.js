var GUI = (function(){ //IIFE for all Views

var TaskView = Backbone.View.extend({
	render: function(){
		var $title= $("<h4>").text(this.app.tasks.description);
		var $desc = something;
		var $creator = something;
		var $assignee = something;
		var $statusSel = something;
		var $statusOpt = something;
		
	},
	initialize: function(opts){
		this.render();
	},
	events:{
		
	}
});

var CreateTaskView = Backbone.View.extend({
	render: function(){
	},
	initialize: function(opts){
		
	},
	events:{
		
	}
});

var UnassignedTasksView = Backbone.View.extend({
	render: function(){
		this.$el.html('<p>Unnassigned Div</p>');
		this.containerDiv.append(this.$el);
	},
	initialize: function(opts){
		if(opts){this.containerDiv = opts.containerDiv;}
	},
	events:{
		
	}
});

var UserTasksView = Backbone.View.extend({
	render: function(){
		this.$el.html('<p>Assigned Div</p>');
		this.containerDiv.append(this.$el);
	},
	initialize: function(opts){
		if(opts){this.containerDiv = opts.containerDiv;}
	},
	events:{
		
	}
});

var UserView = Backbone.View.extend({
	render: function() {
		this.$el.html("<p>Hello " + this.model.attributes.username + "</p>");
		this.$el.attr("id","user_view");
		var $logoutBtn = $('<button id="logout">').text('logout');
		this.$el.prepend($logoutBtn);
		this.appdiv.append(this.$el);
	},
	initialize: function(opts) {
		if(opts){this.appdiv=opts.appdiv;}
		var unass = new UnassignedTasksView({
			model:TaskModel,
			containerDiv: this.$el
		});
		var user = new UserTasksView({
			model:TaskModel,
			containerDiv: this.$el
		});
		this.render();
		unass.render();
		user.render();
	},
	events:{
		"click #logout": "logout"
	},
	logout: function(){
		var loginview= new LoginView({
			collection: app.users, 
			appdiv: this.appdiv
		});
		this.remove();
	}

});

var LoginView = Backbone.View.extend({
	render: function(){
		var $welcome = $("<h2>").text("welcome");
		var $selectUser = $("<select class='selectUser'>");
		var $loginButton = $("<button id='login'>").text("login");
		//console.log(this.collection.models);
		var $defaultOption = $("<option selected='true' disabled>");
		$defaultOption.text("select something");
		$selectUser.append($defaultOption);
		this.collection.models.forEach(function(element,index,array){
			//console.log(element.attributes.username);
			var $userOption = $("<option>").attr("value", element.attributes.username);
			$userOption.text(element.attributes.username);
			$selectUser.append($userOption);
		});
		this.$el.attr("id","login_view");
		this.$el.append($welcome);
		this.$el.append($selectUser);
		this.$el.append($loginButton);
		this.appdiv.append(this.$el);
	},
	initialize: function(opts){
		if(opts){this.appdiv=opts.appdiv;}
		this.render();
	},
	events: {
		"click #login" : "login"
	},
	login: function(){
		var index = _.findIndex(this.collection.models, function(chr) {
			return chr.attributes.username == $(".selectUser").val();
		});

		var userView = new UserView({
			model:this.collection.models[index],
			appdiv:this.appdiv
		});
		this.remove();
	}
});


// generic ctor to represent interface:
function GUI(users,tasks,el) {
	var loginView = new LoginView({
		collection:users, 
		appdiv: $(el)
	});

	// users is collection of User models
	// tasks is collection of Task models
	// el is selector for where GUI connects in DOM

	//...
}

return GUI;
}());
