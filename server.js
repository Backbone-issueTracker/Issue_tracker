
var express = require("express");
var bodyParser = require("body-parser");
var orc = require('./secret.js');
var orchestrate = require('orchestrate')(orc);
var logger = require('morgan');

var app = express();
app.use(logger('dev'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname));

function parseData(data){
  var parsed = [];
  for(var i=0;i<data.body.count;i++){
    parsed.push(data.body.results[i].value);
  }
  return parsed;
}

////////////***********GETS************//////////
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

app.get('/users/:username', function (req, res) {
    var uname = req.params.username;
    orchestrate.search('tasks','value.creator:'+uname+' OR value.assignee:'+uname)
    .then(function(data){
      res.send(parseData(data));
    });
});

app.get('/unassigned', function (req, res) {
    orchestrate.search('tasks','value.assignee:""')
    .then(function(data){
      res.send(parseData(data));
    });
});

////////////***********POSTS************//////////

app.post('/users', function (req, res) {
  orchestrate.post("users", req.body).then(function(data){
    res.send({id:data.path.key});
  });
});

app.post('/tasks', function (req, res) {
  orchestrate.post("tasks", req.body).then(function(data){
    res.send({id:data.path.key});
  });
});

////////////***********PUTS************//////////

app.put('/tasks/:id', function (req, res) {
  orchestrate.put("tasks", String(req.params.id), req.body).then(function(data){
    res.send({id:req.params.id});
  });
});



app.listen(3000, function () {
  console.log("Server is running...........");
});
