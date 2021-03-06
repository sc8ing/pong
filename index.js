let port = 8175;

let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let gameRooms = require('./gamerooms.server.js')(io);

app.get('/*', function(req, res) {
	res.sendFile(__dirname + '/public/' + req.params[0] || 'index.html');
});

http.listen(port, console.log("listening on *:" + port));
