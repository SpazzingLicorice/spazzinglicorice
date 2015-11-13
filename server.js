/*************************************
            DEPENDENCIES
**************************************/
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Board = require('./db/board');
var port = process.env.PORT || 8080;
var handleSocket = require('./server/sockets');

/*************************************
                ROUTES
**************************************/

// Static folder
app.use(express.static(__dirname + '/public'));


// Home Page
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


// Get a new whiteboard
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


// Wildcard & board route id handler
app.get('/*', function(req, res) {
  var board_id = req.url.slice(1);
  var query = Board.boardModel.where({_id: board_id});

  //check if it's a valid board
  query.findOne(function(err, board) {
    //if it is not found send to home page
    if (err) {
      res.redirect('/');
    } else {
      // Start new socket connection with board id for room
      handleSocket(req.url, board, io);

      res.sendFile(__dirname + '/public/board.html');
    }
  });
});

// START
http.listen(port, function() {
  console.log('server listening on', port, 'at', new Date());
});
