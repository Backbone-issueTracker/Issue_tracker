var GUI = (function(){ //IIFE for all Views

var TaskView = Backbone.View.extend({
	tagName: "li",
		className: "list-group-item",
	render: function(){
		// console.log("render has been called");
		var $title= $("<h4>").text(this.model.get("title"));
		var $desc = $('<h5>').text("Description: " + this.model.get("description"));
		var $creator = $('<h6>').text("Creator: " + this.model.get("creator"));
		var $assignee = $('<h6>').text("Assigned to: " + this.model.get("assignee"));
		var $statusSel = $("<select name='statusSelector' class='statusSel form-control'>");
		var $statusOpt1 = $("<option value='Unassigned' class='unass'>").text("Unassigned");
		var $statusOpt2 = $("<option value='Assigned' class='ass'>").text("Mine");
		var $statusOpt3 = $("<option value='In Progress' class='prog'>").text("In Progress");
		var $statusOpt4 = $("<option value='Done' class='done'>").text("Done");

		//building dropdown:
		$statusSel.append($statusOpt1).append($statusOpt2).append($statusOpt3).append($statusOpt4);

		this.$el.append($title).append($desc).append($creator).append($assignee).append($statusSel);


		//Assigned the correct deafult option for the dropdown
		if(this.model.get("status")==="Unassigned"){
			this.$(".unass").attr("selected", "selected");
		}
		if(this.model.get("status")==="Assigned"){
			this.$(".ass").attr("selected", "selected");
		}
		if(this.model.get("status")==="In Progress"){
			this.$(".prog").attr("selected", "selected");
		}
		if(this.model.get("status")==="Done"){
			this.$(".done").attr("selected", "selected");
		}
///////////////////
		// console.log(this.model.attributes.status);
		
		if((this.model.get("assignee")===this.user.get('username')) || (this.model.get("creator")===this.user.get('username'))){
			$('#assDiv').append(this.$el);
		}else if(this.model.get("status")==="Unassigned"){
			$('#unassDiv').append(this.$el);
		}
		
		
	},
	initialize: function(opts){
		if(opts){
			this.user = opts.user;
		}
		this.render();
		this.listenTo(this.model, "change", this.addView);
	},
	events:{
		"change select[name='statusSelector']": "changeStatus"
	},
	changeStatus: function(){
		// console.log("change status is happening right now");
		var self = this;
		var determineAss = function(){
			if(self.$("select[name='statusSelector']").val()==="Unassigned"){
				return "";
			} else {
				return self.user.get('username');	
			}
		};
		// console.log("we are determining the ass:", determineAss());
		this.model.set({
			status: this.$("select[name='statusSelector']").val(),
			assignee: determineAss()
		});
		
		this.remove();
	},
	addView: function(model){
		console.log("running addview");
		this.remove();
		var task = new TaskView({model:model,user:this.user});
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
		this.$el.attr("id","unassDiv");
	},
	initialize: function(opts){
		if(opts){
			this.containerDiv = opts.containerDiv;
			this.user = opts.user;
		}
		this.render();
		var self = this;
		var unassigned = this.collection.where({status:"Unassigned"});
		unassigned.forEach(function(element){
			var task = new TaskView({model:element,user:self.user});
		});

		// this.listenTo(this.collection, "add", this.addView);
		this.listenTo(this.collection, "something2", this.something2);
	},
	events:{

	},
	addView: function(newModel){
		var task = new TaskView({model:newModel,user:this.user});
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
		var self = this;
		var assignee= this.collection.where({assignee:this.user.attributes.username});
		var creator = this.collection.where({creator:this.user.attributes.username});
		var usertasks = _.union(assignee, creator);
		usertasks.forEach(function(element){
			var task = new TaskView({model:element,user:self.user});
		});
		// this.listenTo(this.collection, "add", this.addView);
	},
	events:{

	},
	addView: function(newModel){
		var task = new TaskView({model:newModel,user:this.user});
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
		var $loginButton = $("<button id='login' class='btn btn-primary'>").text("login");
		var $defaultOption = $("<option selected='true' disabled>");
		$defaultOption.text("select something");
		$selectUser.append($defaultOption);
		this.collection.models.forEach(function(element,index,array){
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
