var GUI = (function(){ //IIFE for all Views

var TaskView = Backbone.View.extend({
	render: function(){
		var $title= $("<h4>").text(this.model.attributes.title);
		var $desc = $('<h5>').text("Description: " + this.model.attributes.description);
		var $creator = $('<h6>').text("Creator: " + this.model.attributes.creator);
		var $assignee = $('<h6>').text("Assigned to: " + this.model.attributes.assignee);
		var $statusSel = $("<select class='statusSel'>");
		var $statusOpt1 = $("<option id='unass'>").html("Unassigned");
		var $statusOpt2 = $("<option id='ass'>").html("Assigned");
		var $statusOpt3 = $("<option id='prog'>").html("In Progress");
		var $statusOpt4 = $("<option id='done'>").html("Done");

		//building dropdown:
		$statusSel.append($statusOpt1).append($statusOpt2).append($statusOpt3).append($statusOpt4);

		this.$el.append($title).append($desc).append($creator).append($assignee).append($statusSel);

		if($statusSel.val()==="Unassigned"){
			console.log(this.$el);
			$('#unassDiv').append(this.$el);
		}
	},
	initialize: function(opts){
		this.render();
		this.model.on("change", this.render, this);
	},
	events:{
		"change .statusSel": "changeStatus"
	},
	changeStatus: function(){
		this.model.set("status", $statusSel.val());
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
		console.log("unassigned collection is: ", this.collection.where({status:"Unassigned"}));
		this.$el.attr("id","unassDiv");
	},
	initialize: function(opts){
		if(opts){this.containerDiv = opts.containerDiv;}
		this.render();
		var self = this;
		var unassigned = this.collection.where({status:"Unassigned"});
		unassigned.forEach(function(tsk){
			console.log("model is: ", tsk);
			console.log("Adding Task Instance");
			var task = new TaskView({model:tsk});
			// self.$el.append(task.$el);
		});

		this.listenTo(this.collection, "add", this.addView);
		this.listenTo(this.collection, "something2", this.something2);
	},
	events:{

	},
	addView: function(newModel){
		console.log("Adding Task Instance");
		var task = new TaskView({model:newModel});
	},
	something2: function(){

	}
});

var UserTasksView = Backbone.View.extend({
	render: function(){
		this.$el.html('<p>Assigned Div</p>');
		this.containerDiv.append(this.$el);	console.log("assigned collection is: ", this.collection.where({status:"Assigned"}));
		this.$el.attr("id","assDiv");
	},
	initialize: function(opts){
		if(opts){this.containerDiv = opts.containerDiv;}
		this.render();
		this.listenTo(this.collection, "something", this.something);
		this.listenTo(this.collection, "something2", this.something2);
	},
	events:{

	},
	something: function(){

	},
	something2: function(){

	}
});

var UserView = Backbone.View.extend({
	render: function() {
		this.$el.html("<h2>Hello " + this.model.attributes.username + "</h2>");
		this.$el.attr("id","user_view");
		var $logoutBtn = $('<button id="logout">').text('logout');
		this.$el.prepend($logoutBtn);
		this.appdiv.append(this.$el);
	},
	initialize: function(opts) {
		if(opts){this.appdiv=opts.appdiv;}
		if(opts){this.tasks=opts.tasks;}

		this.render();

		var unass = new UnassignedTasksView({
			model:TaskModel,
			containerDiv: this.$el,
			collection: this.tasks
		});
		var user = new UserTasksView({
			model:TaskModel,
			containerDiv: this.$el,
			collection: this.tasks
		});
		// this.render();
		// unass.render();
		// user.render();
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
		if(opts){this.tasks=opts.tasks;}
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
			appdiv:this.appdiv,
			tasks: this.tasks
		});
		this.remove();
	}
});


// generic ctor to represent interface:
function GUI(users,tasks,el) {
	var loginView = new LoginView({
		tasks: tasks,
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
