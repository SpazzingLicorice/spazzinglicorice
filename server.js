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
          SOCKET CONNECTION
**************************************/
var connect = function(boardUrl) {
  var whiteboard = io.of(boardUrl);

  whiteboard.on('connection', function(socket) {
    //Emit the whole board on join.
    socket.emit('join', board);

    //Store pen properties on stroke object
    socket.on('start', function(pen) {
      socket.stroke = {
        pen: pen,
        path: []
      };
    });

    //Push coordinates into stroke's path array
    socket.on('drag', function(coords) {
      socket.stroke.path.push(coords);

      var payload = {
        pen: socket.stroke.pen,
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
      Board.boardModel.findOne({id: id}, function(err, doc) {
        console.log(doc.strokes);
      });
    });
  });
};
/*************************************
                ROUTES
**************************************/

/**************TBD, using for one global board on server init**********/
// var board = new Board.boardModel({strokes: []});
// var id = board._id;
// board.save(function(err, board) {
//   if (err) { console.error(err); }
//   else {
//     console.log('board saved!');
//   }
// });

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/new', function(req, res) {
  //create a new board
  var board = new Board.boardModel({strokes: []});
  var id = board._id.toString();
  board.save(function(err, board) {
    if (err) { console.error(err); }
    else {
      console.log('board saved!');
    }
  });

  //redirect to the new board
  res.redirect('/' + id);
});

app.get('/*', function(req, res) {
  var board_id = req.url.slice(1);
  var query = Board.boardModel.where({_id: board_id});

  //check if it's a valid board
  query.findOne(function(err, board) {
    //if it is not found send to home page
    if (err) {
      res.redirect('/');

    //otherwise
    } else {
      //start new socket connection with board id for room
      console.log(req.url);
      connect(req.url);
      res.redirect('/board.html');
    }
  });
});






http.listen(port, function() {
  console.log('server listening on', port, 'at', new Date());
});
