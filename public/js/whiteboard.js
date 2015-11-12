var socket = io();

socket.on('join', function(board) {
  console.log(board);
});

//===========global variables===========
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 800;
//===========canvas init===========


var canvas = $('#whiteboard');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// if (typeof G_vmlCanvasManager != 'undefined') {
//   canvas = G_vmlCanvasManager.initElement(canvas);
context = canvas[0].getContext("2d");

var mouse = {
  click: false,
  drag: false,
  x: 0, 
  y: 0  
};

var pen = {
  fillStyle: 'solid',
  strokeStyle: "black",
  lineWidth: 5,
  lineCap: 'round'
};

//=========== socket init functions here=====================


//=========== init window/window resize functions here===========
// var paint = false;



//=========== mouse events============================
var stroke = [];
var draw = function(x, y) {
  context.lineTo(x, y);
  context.stroke();
}
//Mousedown
canvas.on('mousedown', function(e) {
//initialize mouse position
  mouse.click = true;
  mouse.x = e.pageX - this.offsetLeft;
  mouse.y = e.pageY - this.offsetTop;
  //initialize canvas render with current pen style
  for (key in pen) {
    context[key] = pen[key];
  }

  stroke.push([mouse.x, mouse.y]);

  // emit the pen object
  socket.emit('start', pen);

  //begin draw
  context.beginPath();
  context.moveTo(mouse.x, mouse.y);
});

//drag
canvas.on('drag', function(e) {
    mouse.drag = true;
    var offset = $(this).offset();
    var x = e.pageX - offset.left;
    var y = e.pageY - offset.top;
    draw(x, y);
    stroke.push([x, y]);
    console.log([x, y]);
    
    //emit x, y in array
    socket.emit('drag', [x, y]);

});

canvas.on('dragend', function(e) {
    mouse.drag = false;
    mouse.click = false;

 //sample of resulting data to be pushed to db
    console.log([stroke, pen]);
    stroke = [];

 //socket end
  socket.emit('end', null);
});

//do we need this?
canvas.onmouseout = function() {
  mouse.click = false;
  context.closePath();
}

