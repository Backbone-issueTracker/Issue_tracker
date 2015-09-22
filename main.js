var app = {};

$(function() { //when DOM is ready...
	app.users = new UserCollection([
		{username:'Person1'},
		{username:'Person2'},
		{username:'Person3'}
	]);

	app.tasks = new TaskCollection([
		// test data here
	]);

	app.gui = new GUI(app.users,
						app.tasks,
						'#app');// selector of main div
}
