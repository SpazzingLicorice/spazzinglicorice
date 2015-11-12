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

    // Initalizing of the pen - to be customized later
    App.pen = {
      fillStyle: 'solid',
      strokeStyle: "white",
      lineWidth: 5,
      lineCap: 'round'
    };

    App.stroke = [];

    // Draws the board upon join
    App.socket.on('join', function(board) {
      console.log("Joining the board");
      console.log(board);
    });

    // Upon listening to 'drag' event, receives data from the server and draws it to the whiteboard
    App.socket.on('drag', function(data) {
      console.log("Receiving data:", data);
      App.draw(data.coords);
        // receive pay load ddata
        // render canvas payload obj (fillStyle, strokeStyle, lineWidth, lineCap, coords)
        // drag event: get property of each strok + x + y
        // start: just get App.pen info
        // drag: array of arrays (coords)
    });

    // Draws according to coordinates
    // TODO: Need to pass in App.pen properties as parameters
    App.draw = function(x, y) {
      App.context.lineTo(x, y);
      App.context.stroke();
    };

  };

  $(function() {
    // Initialize the app
    App.init();

    //////////////// Mouse Events


    // Upon mousedown event detection: 
    App.canvas.on('mousedown', function(e) {
      console.log("Mousedown event detected");

      // Initialize mouse position
      App.mouse.click = true;
      App.mouse.x = e.pageX - this.offsetLeft;
      App.mouse.y = e.pageY - this.offsetTop;

      // Initialize canvas render with current pen style
      for (var key in App.pen) {
        App.context[key] = App.pen[key];
      }

      // Push mouse coordinates to App.stroke
      App.stroke.push([App.mouse.x, App.mouse.y]);

      // Emit the App.pen object
      App.socket.emit('start', App.pen);

      // Begin draw
      App.context.beginPath();
      App.context.moveTo(App.mouse.x, App.mouse.y);
    });


    // Mousedrag event
    App.canvas.on('drag', function(e) {
      App.mouse.drag = true;

      // Find x,y coordinates of dragging
      var x = e.offsetX;
      var y = e.offsetY;

      // var offset = $(this).offset();
      // var x = e.pageX - offset.left;
      // var y = e.pageY - offset.top;
      App.draw(x, y);
      App.stroke.push([x, y]);
      console.log("Currently drawing coordiantes", [x, y]);

      // Emit x, y in array
      App.socket.emit('drag', [x, y]);

    });

    // Mouse dragend event
    App.canvas.on('dragend', function(e) {
      App.mouse.drag = false;
      App.mouse.click = false;

      // Sample of resulting data to be pushed to db
      console.log("Data being pushed to the server", [App.stroke, App.pen]);

      // Empty App.stroke
      App.stroke = [];

      // Tell socket that we've finished sending data
      App.socket.emit('end', null);
    });

    // Do we need this?
    App.canvas.onmouseout = function() {
      App.mouse.click = false;
      App.context.closePath();
    };



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
