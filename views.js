var GUI = (function(){ //IIFE for all Views

var TaskView = Backbone.View.extend({
	tagName: "li",
		className: "list-group-item",
	render: function(){
		var $title= $("<h4>").text(this.model.get("title"));
		var $desc = $('<h5>').text("Description: " + this.model.get("description"));
		var $creator = $('<h6>').text("Creator: " + this.model.get("creator"));
		var $assignee = $('<h6>').text("Assigned to: " + this.model.get("assignee"));
		var $statusSel = $("<select id='statusSelector' class='statusSel form-control'>");
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
	},
	events:{
		"change select[id='statusSelector']": "changeStatus"
	},
	changeStatus: function(){
		var self = this;
		var determineAss = function(){
			console.log('determining blank or who');
			if(self.$("select[id='statusSelector']").val()==="Unassigned"){
				return "";
			} else {
				return self.user.get('username');
			}
		};
		 console.log("we determined blank or who");

	  this.model.set({
			status: this.$("select[id='statusSelector']").val(),
			assignee: determineAss()
		});
		this.remove();


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
	},
	events:{

	},
	addView: function(model){
		console.log("running addview in unassigned");
		var task = new TaskView({model:model,user:this.user});
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
		console.log("usertasks is: ", usertasks);
		usertasks.forEach(function(element){
			var task = new TaskView({model:element,user:self.user});
		});
	},
	events:{

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
		var taskCreate = new TaskCreateView({
			collection: this.tasks
		});
		
		this.listenTo(this.tasks,"change:status", this.addview);
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
	},
	addview: function(Model){
		var tasks = new TaskView({model:Model, user:this.model});
	}

});


var LoginView = Backbone.View.extend({
	render: function(){
		var $welcome = $("<h2>").text("welcome");
		var $selectUser = $("<select id='selectbar' class='selectUser form-control'>");
		var $loginButton = $("<button id='login' class='btn btn-primary'>").text("login");
		var $defaultOption = $("<option selected='true' disabled>");
		var $registerPrompt = $("<h3>").text("No Account? Register Now!");
		var $register = $('<input id="regbox" type="text" placeholder="**Enter Your Username Here**" style="width:100%">');
		$defaultOption.text("**Select Your Username**");
		$selectUser.append($defaultOption);
		this.collection.models.forEach(function(element,index,array){
			var $userOption = $("<option>").attr("value", element.attributes.username);
			$userOption.text(element.attributes.username);
			$selectUser.append($userOption);
		});
		this.$el.attr("id","login_view");
		this.$el.attr("class","jumbotron");
		this.$el.append($welcome);
		this.$el.append($selectUser);
		this.$el.append($loginButton);
		this.$el.append($registerPrompt).append($register);
		this.appdiv.append(this.$el);
	},
	initialize: function(opts){
		if(opts){this.appdiv=opts.appdiv;}
		if(opts){this.tasks=opts.tasks;}
		this.render();
		this.listenTo(this.collection, "add", this.refreshView);
	},
	events: {
		"click #login" : "login",
		"keypress input" : "updateOnEnter"
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
	},
	updateOnEnter: function(e){
			if(e.keyCode == 13) {
				this.collection.add({username:$('#regbox').val()});
			}
	},
	refreshView: function(){
		console.log("refreshView ran");
		this.remove();
		var loginView = new LoginView({
			tasks: this.tasks,
			collection:this.collection,
			appdiv: this.appdiv
		});
	}
});

var NavView = Backbone.View.extend({
  tagName:"nav" ,
  className: "navbar navbar-inverse" ,
  id: "navbar" ,
  render: function() {
    //Create DOM elements
    var $container = $('<div class="container-fluid">');
    var $navbarHeader = $('<div class="navbar-header">');
    var $logo = $("<a>").attr({
      href: "#",
      class:"navbar-brand"
    }).text("toDo ||");
    console.log(this);
    //console.log(this.username);
		//console.log(this.collection)
      var $ulNavbarRight = $('<ul class="nav navbar-nav navbar-right">');
      var $liCreateTask = $('<li>');
      var $newTaskButton = $( '<button type="button" data-toggle="modal" data-target="#taskCreateView">' );
      $newTaskButton.text( "+" );
      $newTaskButton.addClass("btn btn-default");
      $liCreateTask.append($newTaskButton);
      $ulNavbarRight.append($liCreateTask);
    //Attach DOM elements to their respective parent elements
    $container.append($logo);
    $container.append($ulNavbarRight);
    this.$el.append($container);
    $('body').prepend(this.$el);
		console.log("======== NavView Rendered  ========");
    return this;
  },
  initialize: function(opts){
		if ( opts ) {
			this.testAttribute = opts.testAttribute;
      //this.collection = opts.collection;
			// console.log(opts.testAttribute)
    }
    this.render();
  }
});


var TaskCreateView = Backbone.View.extend({
  tagName: "div",
  className: "modal fade",
  id: "taskCreateView",
  attributes: {
    role:"dialog"
  },
  render: function() {
    //Create DOM elements

    //bootstrap containers
    var $modalDialog = $('<div class="modal-dialog">');
    var $modalContent = $('<div class="modal-content">');

    //modal-header
    var $modalHeader = $('<div class="modal-header">');
    var $modalTitle = $("<h4>").addClass("modal-title").text("New Task");
    var $modalCloseButton = $('<button data-dismiss="modal" aria-hidden="true">').attr({
       type:"button",
       class:"close"
    }).text("x");

    //modal-body
    var $modalBody = $('<div class="modal-body">');

    var $newTaskForm = $('<form id="createTaskForm">').addClass("form-horizontal");
    var $titleGroup = $('<div class="form-group">');
    var $taskTitleLabel = $('<label for="title">').addClass("control-label").text("Title");
    var $taskTitle = $('<input type="text" id="createTaskTitle" name="title">').addClass("form-control");
    var $taskDescriptionLabel = $('<label for="description">').text("Description");
    var $taskDescription = $('<textarea id="createTaskDescription" name="description">').addClass("form-control");
    var $taskStatusLabel = $('<label for="status">').text("Status");
    var $statusSelect = $('<select id="createTaskStatusSelect" name="status">').addClass("form-control");
    var $unassignedOption = $('<option value="Unassigned">').text("Unassigned");
    var $assignedOption = $('<option value="Assigned">').text("Assigned");
    var $inProgressOption = $('<option value="In Progress">').text("In Progress");
    var $doneOption = $('<option value="Done">').text("Done");

    //modal-footer
    var $modalFooter = $('<div class="modal-footer">');
    var $cancelButton = $('<button data-dismiss="modal">').attr({
      type: "button",
      class:"btn btn-default"
    }).text("cancel");
    var $createTaskButton = $('<button id="taskCreate">').attr({
      role: "button",
      class:"btn btn btn-primary"
    }).text("Create").attr("data-dismiss","modal");

    //Attach DOM elements to their respective parent elements
    $modalHeader.append($modalCloseButton);
    $modalHeader.append($modalTitle);
    $statusSelect.append($unassignedOption).append($assignedOption).append($inProgressOption).append($doneOption);
    $newTaskForm.append($taskTitleLabel).append($taskTitle);
    $newTaskForm.append($taskDescriptionLabel).append($taskDescription);
    $newTaskForm.append($taskStatusLabel).append($statusSelect);
    $modalBody.append($newTaskForm);
    $modalFooter.append($cancelButton).append($createTaskButton);
    $modalContent.append($modalHeader).append($modalBody).append($modalFooter);
    $modalDialog.append($modalContent);
    this.$el.append($modalDialog);
    $('body').append(this.$el);
    console.log("======== TaskCreateView Rendered  ========");
    return this;
  },
  initialize: function(opts){
    this.render();
  },
  events:{
    		"click #taskCreate": "taskCreate"
  },
	taskCreate: function(){
    console.log(" ++++ Task Create ++++ ");
		var createTaskTitle = $('input[id="createTaskTitle"]').val();
		var createTaskDescription = $('textarea[id="createTaskDescription"]').val();
		var createTaskCreator = "GOD";
		var createTaskAssignee = "y'all";
		var createTaskStatus = $('select[id="createTaskStatusSelect"]').val();
		//Collection is updated
    this.collection.add({
      title: createTaskTitle,
      description: createTaskDescription,
      creator: createTaskCreator,
      assignee: createTaskAssignee,
      status: createTaskStatus
	  });
		//Modal closes ====> TBD
		//Modal Form Elements clear
		document.getElementById("createTaskForm").reset();
		console.log(this.collection);
  }
});



// generic ctor to represent interface:
function GUI(users,tasks,el) {
	var loginView = new LoginView({
		tasks: tasks,
		collection:users,
		appdiv: $(el)
	});
	var navView = new NavView({
		//Test attribute
		testAttribute: "Hello World"
	});
	// users is collection of User models
	// tasks is collection of Task models
	// el is selector for where GUI connects in DOM

	//...
}

return GUI;
}());
