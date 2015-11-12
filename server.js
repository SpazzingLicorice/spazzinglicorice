var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;

app.use(express.static('public'));

io.on('connection', function(socket) {
  // socket.on('', function(payload));
  // socket.emit('', payload);
});

http.listen(port, function() {
  console.log('server listening on', port, 'at', new Date());
})