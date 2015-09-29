
var express = require("express");
var bodyParser = require("body-parser");
var orc = require('./secret.js');
var orchestrate = require('orchestrate')(orc);
var logger = require('morgan');

var app = express();
app.use(logger('dev'));

// function Listdb(){
//   orchestrate.list("1st Collection").then(function (response){
//     response.body.results.map(function(e,i){
//       // console.log(e.value);
//     });
//   });
// }
// 
// orchestrate.put("1st Collection", "0",{
// 			"title":"Orch test",
// 			"description":"better work",
// 			"creator": "Sparky",
// 			"assignee":"",
// 			"status":"Unassigned"
// }).then(function(res){
//   Listdb();
// });



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname));

// var users = [];
// var users = ["Sparky", "Skippy", "Arturo"];
// var tasks = [];
// var tasks = [
//   ["Steal Redvines","Run from coppers","Skippy","","Unassigned"],
//   ["The big bug","don't break","Sparky","","Unassigned"],
//   ["broken one","this one is broken","Skippy","Skippy","Done"],
//   ["Give Redvines","Hi five coppers","Arturo","","Unassigned"],
//   ["Write a book","finish it before i die(GRRM)","Arturo","Arturo","Assigned"]
// ];

app.get('/users', function (req, res) {
  var users;
  orchestrate.list("users").then(function(data){
    users=data.body.results;
  var usersAndIDs = users.map(function (e, index) {
    var x = {};
    x.id = e.path.key;
    x.username = e.value.username;
    return x;
  });
  res.send(usersAndIDs);
  console.log("users are: ", usersAndIDs);
});
});

app.get('/tasks', function (req, res) {
  var tasks;
  orchestrate.list("tasks").then(function(data){
    tasks = data.body.results;
    var tasksAndIDs = tasks.map(function (e, index) {
      // var element= e["value"];
      e.value.id = e.path.key;
      return e.value;
    });
    res.send(tasksAndIDs);
    console.log("tasks: ", tasksAndIDs);
  });
});

// app.put('/users/:id', function (req, res) {
//     var id = req.params.id;
//     orchestrate.put('users', id, req.body.username);
//     res.send({id: id});
// });

app.post('/users', function (req, res) {
  orchestrate.post("users", req.body).then(function(data){
    res.send({id:data.path.key});
  });
});

app.put('/tasks/:id', function (req, res) {
  orchestrate.put("tasks", String(req.params.id), req.body).then(function(data){
    res.send({id:req.params.id});
  });
});

app.post('/tasks', function (req, res) {
  orchestrate.post("tasks", req.body).then(function(data){
    res.send("yay");
  });
});



// app.get('/texts/:id', function (req, res) {
//     var id = req.params.id;
//     res.send(JSON.stringify({id: id, value : texts[id]}));
// });
//
// app.put('/texts/:id', function (req, res) {
//     var id = req.params.id;
//     tasks[id] = req.body.value;
//     res.send({id: id});
// });
//
// app.delete('/texts/:id', function (req, res) {
//     var id = req.params.id;
//     texts.splice(id, 1);
//     res.send({id: id});
// });
//
// app.get('/texts', function (req, res) {
//     var textsAndIDs = texts.map(function (v, i) {
//         return {id : i, value : v};
//     });
//     res.send(textsAndIDs);
// });



app.listen(3000, function () {
  console.log("Server is running...........");
});
