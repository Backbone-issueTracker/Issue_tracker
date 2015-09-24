var UserModel = Backbone.Model.extend({
	defaults: {
		username:''
	}
});

var TaskModel = Backbone.Model.extend({
	defaults: {
		title:'',
		description:'',
		creator:'',
		assignee:'',
		status:'Unassigned',
	}
	// Add methods if needed...
});

var UserCollection = Backbone.Collection.extend({
	model:UserModel
});

var TaskCollection = Backbone.Collection.extend({
	model:TaskModel
});
