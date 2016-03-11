var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use("/styles", express.static(__dirname + '/styles'));
app.use("/scripts", express.static(__dirname + '/scripts'));
app.use("/images", express.static(__dirname + '/images'));
app.use("/data", express.static(__dirname + '/data'));
app.use("/vendor", express.static(__dirname + '/vendor'));

var io = require('socket.io')(http);

var namespaceName 					= null,
		numUsers								= 0,

		connectionRegistered 		= false,
		connectionNamespace,
		connectionNamespaceList = {};

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
  if (req.query.category && req.query.eventId) {
		namespaceName = req.query.category + "-" + req.query.eventId;

		console.log(namespaceName);

		nsp = io.of('/' + namespaceName);
		if (!connectionRegistered || (connectionNamespace != namespaceName && !connectionNamespaceList[namespaceName])) {
			console.log('Register : ' + namespaceName);
			var numUsers = 0;
			nsp.on('connection', function(socket) {
				if (req) {
				  console.log(req.query.userId + ' connected');
				  // On new message send
				  socket.on('new message', function (data) {
				    socket.broadcast.emit('new message', {
				    	data: data
				    });
				  });

				  numUsers++;

			    nsp.emit('user join', {
			    	numUsers: numUsers
			    });

					socket.on('disconnect', function () {
						console.log('disconnect');
					  if (numUsers > 0) {
					    --numUsers;
					    socket.broadcast.emit('user left', {
					      numUsers: numUsers
					    });
					  }
					});
				}
				connectionRegistered = true;
				connectionNamespace = namespaceName;
				connectionNamespaceList[namespaceName] = true;
			});
		}
	}
});


http.listen(8000, function() {
  console.log('listening on *:8000');
});