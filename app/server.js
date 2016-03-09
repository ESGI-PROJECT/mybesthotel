var app = require('express')();
var http = require('http').Server(app);

var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendfile('socket.html');

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

http.listen(3000, function(){
  console.log('listening on *:3000');
});