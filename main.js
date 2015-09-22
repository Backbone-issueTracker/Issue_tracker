var app = {};

$(document).ready( function() { //when DOM is ready...
	app.users = new UserCollection([
		{username:'Sparky'},
		{username:'Skippy'},
		{username:'Arturo'}
	]);

	app.tasks = new TaskCollection([
		// test data here
	]);

	app.gui = new GUI(app.users,
						app.tasks,
						'#app');// selector of main div
});
