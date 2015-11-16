////// Initialize the app ///////

$(function() {
  // Initialize the app
  App.init();

  //////////// Set Videos to be Draggable //////////////  
  $('#localVideo').draggable();
  $('#remoteVideos').draggable();

  //////////// Mouse Events //////////////

  // Upon mousedown event detection: 
  App.canvas.on('mousedown', function(e) {

    if (!App.isAnotherUserActive) {
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
    }


  });


  // Mousedrag event
  App.canvas.on('drag', function(e) {
    if (App.mouse.click) {
      console.log("Dragging");
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
    }


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

  App.canvas.on('mouseleave', function(e) {
    App.canvas.trigger('dragend');
  });


});
