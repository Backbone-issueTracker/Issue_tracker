var GUI = (function(){ //IIFE for all Views

var TaskView = Backbone.View.extend({

});

var CreateTaskView = Backbone.View.extend({

});

var UnassignedTasksView = Backbone.View.extend({

});

var UserTasksView = Backbone.View.extend({

});

var UserView = Backbone.View.extend({
	render: function() {
		this.$el.html("<p>Hello " + this.model.attributes.username + "</p>");

		$("#app").append(this.$el);
	},
	initialize: function() {
		console.log(this.model.attributes.username);
		this.render();
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
	},
	initialize: function(){
		this.render();
	},
	events: {
		"click #login" : "userView"
	},
	userView: function(){
		var index = _.findIndex(this.collection.models, function(chr) {
			return chr.attributes.username == $(".selectUser").val();
		});
		console.log("You logged in with user tied to model at index " + index + ".");

		var userView = new UserView({model: this.collection.models[index]});
		this.remove();
	}
});


// generic ctor to represent interface:
function GUI(users,tasks,el) {
	var loginView = new LoginView({collection:users});
	$(el).append(loginView.$el);

	// users is collection of User models
	// tasks is collection of Task models
	// el is selector for where GUI connects in DOM

	//...
}

return GUI;
}())
