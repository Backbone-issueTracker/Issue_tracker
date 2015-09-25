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
			creator:'Skippy',
			assignee:'',
			status:'Unassigned'
		},
		{
			title:"The big bug",
			description:"has been defeated",
			creator: "Sparky",
			assignee:"",
			status:"Unassigned"
		},
		{
			title:'not broken one',
			description:'this one is not broken',
			creator:'Skippy',
			assignee:'Skippy',
			status:'Done'
		},
		{
			title:'Something',
			description:'Something else',
			creator:'Anyone',
			assignee:'Skippy',
			status:'Assigned'
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
			assignee:'Arturo',
			status:'Assigned'
		}
	]);

	app.gui = new GUI(app.users,
						app.tasks,
						'#app');// selector of main div
});
