(function() {

  var CANVAS_WIDTH = window.innerWidth;
  var CANVAS_HEIGHT = window.innerHeight;

  var App = {};

  // Initialize the App
  App.init = function() {
    App.socket = io();

    // Getting properties of the whiteboard
    App.canvas = $('#whiteboard');
    App.canvas.width = CANVAS_WIDTH;
    App.canvas.height = CANVAS_HEIGHT;
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

      console.log("Receiving data from another user:", data);

      // Socket listens and sends 1 pixel at a time, but canvas drawing works with an initial starting point. App.prevPixel is an array of the previous coordinates sent, so drawing is smoothly rendered across different browsers. 
      // If the App.prevPixel array is empty (i.e., this is the first pixel of the drawn element), then prevPixel is set as the current mouseclick coordinates. 
      // Therefore, the rendering is not quite identical across different browsers. 
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
    });

  };


  ////// Initialize the app ///////

  $(function() {
    // Initialize the app
    App.init();

    //////////// Mouse Events //////////////

    // Upon mousedown event detection: 
    App.canvas.on('mousedown', function(e) {
      console.log("User has started to draw.");

      // Initialize mouse position
      App.mouse.click = true;
      App.mouse.x = e.pageX - this.offsetLeft;
      App.mouse.y = e.pageY - this.offsetTop;

      // Add the first mouse coordinates to stroke array for storage
      App.stroke.push([App.mouse.x, App.mouse.Y]);
      App.initializeMouseDown(App.pen, App.mouse.x, App.mouse.y);

      // Emit the pen object
      App.socket.emit('start', App.pen);
    });


    // Mousedrag event
    App.canvas.on('drag', function(e) {
      App.mouse.drag = true;

      // Find x,y coordinates of dragging
      var x = e.offsetX;
      var y = e.offsetY;

      // Render the drawing
      App.draw(x, y);

      console.log("Currently drawing coordinates", [x, y]);

      // Continue to push coordinates to stroke array (as part of storage)
      App.stroke.push([x, y]);

      // Emit x, y in array
      App.socket.emit('drag', [x, y]);

    });

    // Mouse dragend event
    App.canvas.on('dragend', function(e) {
      App.mouse.drag = false;
      App.mouse.click = false;

      // Sample of resulting data to be pushed to db
      console.log("Drawing is finished and its data is being pushed to the server", [App.stroke, App.pen]);

      // Empty App.stroke
      App.stroke = [];

      // Tell socket that we've finished sending data
      App.socket.emit('end', null);
    });



    //===========global variables===========
    // var CANVAS_WIDTH = 800;
    // var CANVAS_HEIGHT = 800;
    // function resizeCanvas() {
    //    canvas.width = width = window.innerWidth;
    //    canvas.height = height = window.innerHeight;
    // }



    //===========canvas init===========

    // if (typeof G_vmlCanvasManager != 'undefined') {
    //   canvas = G_vmlCanvasManager.initElement(canvas);


    // context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // window.onresize = (function() {
    //   // var timeout;
    //   return function() {
    //     // clearTimeout(timeout);
    //     // resizeCanvas();
    //     // timeout = setTimeout(function() {
    //     //    redraw();
    //     // }, 100);
    // console.log("Before", canvas.width, canvas.height);
    //     context.canvas.width = window.innerWidth;
    //     context.canvas.height = window.innerHeight;
    //     console.log("After", context.canvas.width, context.canvas.height);

    //   }
    // })();



    //=========== App.socket init functions here=====================


    //=========== init window/window resize functions here===========
    // var paint = false;

  });

}).call(this);
