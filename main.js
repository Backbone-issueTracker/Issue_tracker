var app = {};

$(document).ready( function() { //when DOM is ready...
	app.users = new UserCollection([
		{username:'Sparky'},
		{username:'Skippy'},
		{username:'Arturo'}
	]);

	app.tasks = new TaskCollection([
		{
			title:'Steal Redvines',
			description:'Run from coppers',
			creator:'Honest Abe',
			assignee:'',
			status:'unassigned',
		}
	]);

	app.gui = new GUI(app.users,
						app.tasks,
						'#app');// selector of main div
});
