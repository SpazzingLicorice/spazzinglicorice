var Board = require('../db/board');

/*************************************
          SOCKET CONNECTION
**************************************/
var connect = function(boardUrl, board, io) {
  var whiteboard = io.of(boardUrl);

  whiteboard.once('connection', function(socket) {
    //Emit the whole board on join.
    socket.emit('join', board);

    //Store pen properties on stroke object
    socket.on('start', function(pen) {
      /******************************
      A stroke is essentially a continous
      line drawn by the user 
      *******************************/
      socket.stroke = {
        pen: pen,
        path: []
      };
    });

    //Push coordinates into stroke's path array
    socket.on('drag', function(coords) {
      // Add the new coordinates stroke's path
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

      //Get the board that the socket is connected to
      var id = socket.nsp.name.slice(1);

      //Update the board with the new stroke
      Board.boardModel.update({id: id},{$push: {strokes: finishedStroke} },{upsert:true},function(err, board){
        if(err){ console.log(err); }
        else {
          console.log("Successfully added");
        }
      });
      console.log('draw finished', board);

      // Emit end event to everyone but the person who stopped drawing.
      socket.broadcast.emit('end', null);

      //Delete the stroke object to make room for the next stroke.
      delete socket.stroke;
    });
  });
};

module.exports = connect;
