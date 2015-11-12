/*************************************
            DEPENDENCIES
**************************************/
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Board = require('./db/board');
var port = process.env.PORT || 8080;

/*************************************
                ROUTES
**************************************/
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

/**************TBD, using for one global board on server init**********/
var board = new Board.boardModel({strokes: []});
var id = board._id;
board.save(function(err, board) {
  if (err) { console.error(err); }
  else {
    console.log('board saved!');
  }
});

/*************************************
          SOCKET CONNECTION
**************************************/
io.on('connection', function(socket) {
  //Emit the whole board on join.
  socket.emit('join', board);

  //Store pen properties on stroke object
  socket.on('start', function(pen) {
    socket.stroke = pen;
    socket.stroke.path = [];
  });

  //Push coordinates into stroke's path array
  socket.on('drag', function(coords) {
    socket.stroke.path.push(coords);
    var payload = {
      fillStyle: socket.stroke.fillStyle,
      strokeStyle: socket.stroke.strokeStyle,
      lineWidth: socket.stroke.lineWidth,
      lineCap: socket.stroke.lineCap,
      coords: coords
    };

    //Broadcast new line coords to everyone but the person who drew it.
    socket.broadcast.emit('drag', payload);
  });

  //When stroke is finished, push it to our db.
  socket.on('end', function() {
    var finishedStroke = socket.stroke;

    //This will take the board id from the client
    Board.boardModel.update({id: id},{$push: {strokes: finishedStroke} },{upsert:true},function(err, board){
      if(err){ console.log(err); }
      else {
        console.log("Successfully added");
      }
    });

    //Delete the stroke object to make room for the next stroke.
    delete socket.stroke;

    /**************TEST IF THE PROPERTIES WERE SAVED**********/
    // Board.boardModel.findOne({id: id}, function(err, doc) {
    //   console.log(doc.strokes);
    // });
  });
});



http.listen(port, function() {
  console.log('server listening on', port, 'at', new Date());
});
