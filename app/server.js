var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use("/styles", express.static(__dirname + '/styles'));
app.use("/scripts", express.static(__dirname + '/scripts'));
app.use("/images", express.static(__dirname + '/images'));
app.use("/data", express.static(__dirname + '/data'));
app.use("/vendor", express.static(__dirname + '/vendor'));

var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');

  var dataBag = {};

	dataBag.username 	= req.query.username;
	dataBag.message		= req.query.message;
	dataBag.room 			= req.query.room;

	io.on('connection', function(socket) {
		if (!dataBag.room) {
			// Create room
		} else if (dataBag.room && dataBag.message) {
			// Connect to the room
			// Send the message
		  socket.on('new message', function (data) {
		    socket.broadcast.emit('new message', dataBag);
		  });
		}

	});
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});