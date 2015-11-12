var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + 'public'));

app.get('/', function(req, res) {
  console.log(req.url);
  res.sendFile(__dirname + '/public/index.html');
})

io.on('connection', function(socket) {
  // socket.on('', function(payload));
  // socket.emit('', payload);
});

http.listen(port, function() {
  console.log('server listening on', port, 'at', new Date());
})