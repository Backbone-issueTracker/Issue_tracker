var GUI = (function(){ //IIFE for all Views

var TaskView = Backbone.View.extend({
	tagName: "li",
		className: "list-group-item",
	render: function(){
		var $title= $("<h4>").text(this.model.attributes.title);
		var $desc = $('<h5>').text("Description: " + this.model.attributes.description);
		var $creator = $('<h6>').text("Creator: " + this.model.attributes.creator);
		var $assignee = $('<h6>').text("Assigned to: " + this.model.attributes.assignee);
		var $statusSel = $("<select name='statusSelector' class='statusSel form-control'>");
		var $statusOpt1 = $("<option value='Unassigned' class='unass'>").text("Unassigned");
		var $statusOpt2 = $("<option value='Assigned' class='ass'>").text("Assigned");
		var $statusOpt3 = $("<option value='In Progress' class='prog'>").text("In Progress");
		var $statusOpt4 = $("<option value='Done' class='done'>").text("Done");
		// console.log("$el", this.$el[0]);
		//building dropdown:
		$statusSel.append($statusOpt1).append($statusOpt2).append($statusOpt3).append($statusOpt4);

		this.$el.append($title).append($desc).append($creator).append($assignee).append($statusSel);

		if($statusSel.val()==="Unassigned"){
			// console.log(this.$el);
			$('#unassDiv').append(this.$el);
		}
		
		console.log(this.user);
		
		if($assignee.val()===this.user){
			$('#assDiv').append(this.$el);
		}
	},
	initialize: function(opts){
		if(opts){this.user=opts.user;}
		this.render();
		this.model.on("change", this.render, this);
	},
	events:{
		"change select[name='statusSelector']": "changeStatus"
	},
	changeStatus: function(){
		console.log("The value is: ", this.$('select[name="statusSelector"]').val());
		console.log("model is: ", this.model);
		this.model.set("status", this.$("select[name='statusSelector']").val());
		this.remove();
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
	tagName: "ul",
	className: "list-group",
	render: function(){
		this.$el.html('<h3>Unnassigned Tasks</h3>');
		this.containerDiv.append(this.$el);
		// console.log("unassigned collection is: ", this.collection.where({status:"Unassigned"}));
		this.$el.attr("id","unassDiv");
	},
	initialize: function(opts){
		if(opts){this.containerDiv = opts.containerDiv;
		this.user=opts.user;}
		this.render();
		var unassigned = this.collection.where({status:"Unassigned"});
		unassigned.forEach(function(element){
			console.log("element is: ", element);
			var task = new TaskView({model:element,user:this.user});
		});

		this.listenTo(this.collection, "add", this.addView);
		this.listenTo(this.collection, "something2", this.something2);
	},
	events:{

	},
	addView: function(newModel){
		// console.log("Adding Task Instance");
		var task = new TaskView({model:newModel,user:this.user});
	},
	something2: function(){

	}
});

var UserTasksView = Backbone.View.extend({
	tagName: "ul",
	className: "list-group",
	render: function(){
		this.$el.html('<h3>My Tasks</h3>');
		this.containerDiv.append(this.$el);
		this.$el.attr("id","assDiv");
	},
	initialize: function(opts){
		if(opts){this.containerDiv = opts.containerDiv;
			this.user=opts.user;}
		this.render();
		var usertasks = this.collection.where({assignee:this.user.attributes.username});
		usertasks.forEach(function(element){
			console.log("element is: ", element);
			var task = new TaskView({model:element,user:this.user});
		});
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
		var $logoutBtn = $('<a href="" id="logout">').text('logout');
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
			collection: this.tasks,
			user: this.model
		});
		var user = new UserTasksView({
			model:TaskModel,
			containerDiv: this.$el,
			collection: this.tasks,
			user: this.model
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
		var $selectUser = $("<select class='selectUser form-control'>");
		var $loginButton = $("<button id='login' class='btn btn-default'>").text("login");
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
