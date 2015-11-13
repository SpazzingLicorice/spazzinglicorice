angular.module('whiteboard', ['ui.router'])
  .config(function($stateProvider) {
    $stateProvider
      .state('eraser', {
        controller: 'toolbar'
      });
  })
  .controller('canvas', function($rootScope, $scope, tools) {

    var App = {};

    $rootScope.app = App;

    // (function() {

    var CANVAS_WIDTH = window.innerWidth;
    var CANVAS_HEIGHT = window.innerHeight;


    // Initialize the App
    App.init = function() {
      var ioRoom = window.location.href;
      App.socket = io(ioRoom);

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
        App.mouse.x = e.offsetX;
        App.mouse.y = e.offsetY;

        // Initialize methods to prepare for drawing
        App.initializeMouseDown(App.pen, App.mouse.x, App.mouse.y);

        // Emit the pen object
        App.socket.emit('start', App.pen);

        // Add the first mouse coordinates to stroke array for storage
        App.stroke.push([App.mouse.x, App.mouse.Y]);
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


    });

  })

.controller('toolbar', function($scope, tools) {
  $scope.changePen = function(option) {
    tools.changePen(option);
  };
})

.service('tools', function($rootScope) {
  var changePen = function(option) {
    console.log($rootScope.app.pen);
    if (option === 'eraser') {
      console.log("User is using the eraser");

      $rootScope.app.pen.lineWidth = 50;
      $rootScope.app.pen.strokeStyle = '#F0F0F0';
    } else {
      console.log("User is using the pen");
      $rootScope.app.pen.lineWidth = 5;
      $rootScope.app.pen.strokeStyle = option;
    }
  };
  return {
    changePen: changePen
  };

});

// }).call(this);
