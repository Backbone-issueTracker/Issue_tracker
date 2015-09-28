
var express = require('express');
var bodyParser = require('body-parser');
var orc = require('./secret.js');
var orchestrate = require('orchestrate')(orc);
var app = express();


function Listdb(){
  orchestrate.list("1st Collection").then(function (response){
    response.body.results.map(function(e,i){
      console.log(e.value);
    });
  });
}

orchestrate.put("1st Collection", "0",{
			"title":"Orch test",
			"description":"better work",
			"creator": "Sparky",
			"assignee":"",
			"status":"Unassigned"
}).then(function(res){
  Listdb();
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(express.static(__dirname));

var database = {};

database.users = [
	{id:0, username:'Dan'},
	{id:1, username:'Tom'},
	{id:2, username:'Shackleton'}
];

database.issues = [
	{id:0, title:'Do some work', description:'Finish all the things', creator:'Dan'},
	{id:1, title:'go kat fud stor', description:'', creator:'Shackleton'},
	{id:2, title:'ticl dog', description:'deserv itt', creator:'Shackleton', status:'claimed', assignee:'Shackleton'}
];

function showData(collname) {
	console.log(collname+' data store is now: ', database[collname]);
}

function getOne(collname) {
	app.get('/'+collname+'/:id', function (req, res) {
		var id = req.params.id;
		console.log('Sending model #%s...',id);
		res.send(database[collname][id]);
	});
}

function putOne(collname) {
	app.put('/'+collname+'/:id', function (req, res) {
		var id = req.params.id;
		console.log('Receiving model #%s...',id);
		database[collname][id] = req.body;
		showData(collname);
		res.send({});
	});
}

function postOne(collname) {
	app.post('/'+collname, function (req, res) {
		console.log('Receiving new model...');
		var newid = database[collname].length;
		console.log('Assigning id of %s',newid);
		var obj = req.body;
		obj.id = newid;
		database[collname][newid] = obj;
		showData(collname);
		res.send(obj);
	});
}

function getAll(collname) {
	app.get('/'+collname, function (req, res) {
		console.log('Sending all models...');
		showData(collname);
		res.send(database[collname]);
	});
}

function makeRoutes(collname) {
	getOne(collname);
	postOne(collname);
	putOne(collname);
	getAll(collname);
}

Object.keys(database).forEach(makeRoutes);

app.listen(3000);
Object.keys(database).forEach(showData);

