// Initialize the App

var App = {};

App.init = function() {
  var ioRoom = window.location.href;
  App.socket = io(ioRoom);

  //////////// Video Chat ///////////////

  //Create Video chat Object
  var webrtc = new SimpleWebRTC({
      // the id/element dom element that will hold "our" video
      localVideoEl: 'localVideo',
      // the id/element dom element that will hold remote videos
      remoteVideosEl: 'remoteVideos',
      // immediately ask for camera access
      autoRequestMedia: true
  });

  webrtc.on('readyToCall', function () {
      // The room name is the same as our socket connection
      webrtc.joinRoom(ioRoom);
  });

  //////////// Whiteboard ///////////////

  // Getting properties of the whiteboard
  App.canvas = $('#whiteboard');
  App.canvas[0].width = window.innerWidth;
  App.canvas[0].height = window.innerHeight * 0.7;
  App.context = App.canvas[0].getContext("2d");

  // Properties of the mouse click
  App.mouse = {
    click: false,
    drag: false,
    x: 0,
    y: 0
  };

  // Initalizing pen properties. Add new drawing features here
  App.pen = {
    fillStyle: 'solid',
    strokeStyle: "black",
    lineWidth: 5,
    lineCap: 'round'
  };

  App.isAnotherUserActive = false;
  App.stroke = [];
  App.prevPixel = [];


  //////////// Methods ///////////////


  // Draws according to coordinates
  App.draw = function(x, y) {
    App.context.lineTo(x, y);
    App.context.stroke();
  };

  // Initialize before drawing 
  App.initializeMouseDown = function(pen, moveToX, moveToY) {

    // Copy over current pen properties (e.g. fillStyle)
    for (var key in pen) {
      App.context[key] = pen[key];
    }

    // Begin draw
    App.context.beginPath();
    App.context.moveTo(moveToX, moveToY);
  };



  //////////// Socket events //////////

  // Draws the board upon join
  App.socket.on('join', function(board) {
    console.log("Joining the board.");
  });


  // Upon listening to 'drag' event, receives data from the server and draws it to the whiteboard
  App.socket.on('drag', function(data) {
    App.isAnotherUserActive = true;
    console.log("Receiving data from another user:", data);

    // Socket listens and sends 1 pixel at a time, but canvas drawing works with an initial starting point. App.prevPixel is an array of the previous coordinates sent, so drawing is smoothly rendered across different browsers. 
    // If the App.prevPixel array is empty (i.e., this is the first pixel of the drawn element), then prevPixel is set as the current mouseclick coordinates. 
    if (App.prevPixel.length === 0) {
      App.prevPixel = data.coords;
    }

    App.initializeMouseDown(data.pen, App.prevPixel[0], App.prevPixel[1]);
    App.draw(data.coords[0], data.coords[1]);

    // Set the current coordinates as App.prevPixel, so the next pixel rendered will be smoothly drawn from these coordinate points to the next ones. 
    App.prevPixel = data.coords;

  });

  // When the user has mouseup (and finished drawing) then App.prevPixel will be emptied.
  App.socket.on('end', function() {
    App.prevPixel = [];
    App.context.closePath();
    App.isAnotherUserActive = false;
  });

};


