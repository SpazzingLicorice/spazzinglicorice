var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Board = require('./db/board');
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + 'public'));

app.get('/', function(req, res) {
  console.log(req.url);
  res.sendFile(__dirname + '/public/index.html');
})

io.on('connection', function(socket) {
  //on start
  socket.on('start', function(pen) {
    socket.stroke = pen;
    socket.stroke.path = [];
  });

  socket.on('drag', function(coords) {
    socket.stroke.path.push(coords);

    var payload = {
      fillStyle: socket.stroke.fillStyle,
      strokeStyle: socket.stroke.strokeStyle,
      lineWidth: socket.stroke.lineWidth,
      lineCap: socket.stroke.lineCap,
      coords: coords
    };
    //broadcast new line coords to everyone but the person who drew it
    socket.broadcast.emit('drag', payload);
  });

  //push the stroke to our db
  socket.on('end', function() {
    //args err doc?
    Board.boardModel.findByIdAndUpdate(id, {}, function(doc) {
      doc.strokes.push(socket.stroke);
    });
    delete socket.stroke;
  });
});

http.listen(port, function() {
  console.log('server listening on', port, 'at', new Date());
})