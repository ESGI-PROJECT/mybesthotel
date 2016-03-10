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

	if (req.query.category && req.query.eventId) {
		var namespaceName = req.query.category + "-" + req.query.eventId;

		var nsp = io.of('/' + namespaceName);
		nsp.on('connection', function(socket) {
		  console.log(req.query.userId + ' connected');
		  // On new message send
		  socket.on('new message', function (data) {
		    socket.broadcast.emit('new message', {
		    	data: data
		    });
		  });
		});

		// nsp.emit('new message', "plop");
	  // when the user disconnects.. perform this
	  nsp.on('disconnect', function () {
	    // if (addedUser) {
	    //   --numUsers;

	      // echo globally that this client has left
	      socket.broadcast.emit('user left', {
	        // username: socket.username,
	        // numUsers: numUsers
	      });
	    // }
	  });
	}

});

http.listen(8000, function() {
  console.log('listening on *:8000');
});