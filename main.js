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
			status:'Unassigned'
		},
		{
			title:'Give Redvines',
			description:'Hi five coppers',
			creator:'Evil Abe',
			assignee:'',
			status:'Unassigned'
		},
		{
			title:'Write a book',
			description:'finish it before i die(GRRM)',
			creator:'Kanye East',
			assignee:'Kim',
			status:'Assigned'
		}
	]);

	app.gui = new GUI(app.users,
						app.tasks,
						'#app');// selector of main div
});
