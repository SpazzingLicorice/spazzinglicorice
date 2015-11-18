var expect = require('chai').expect;
var handler = require('../server/sockets');
// var Board = require('../db/board').boardModel;
var socket = require('socket.io-client');
var io = require('socket.io')(9000);

describe("Server side socket handler", function() {

  // Initialize server socket handler which registers event listeners
  var testBoard = {
    _id: "test",
    strokes: [
      [[1,1],[2,2],[3,3]],
      [[4,4],[5,5],[6,6]],
      [[7,7],[8,8],[9,9],[7,10],[8,10],[9,10]]
    ]
  };

  handler('/test', testBoard, io);

  var client1, client2;
  var options = { multiplex: false };

  beforeEach(function(done) {
    client1 = socket('http://localhost:9000/test', options);
    client1.on('connect', function() {
      client2 = socket('http://localhost:9000/test', options);
      // client2.on('connect', function() {
        done();
      // });
    });
  });

  afterEach(function(done) {
    client1.disconnect();
    client2.disconnect();
    done();
  });

  it('Should send back the requested board history on connection', function(done) {
    client2.on('connect', function() {
      console.log('hello')
    })
    client1.on('join', function(board) {
      console.log('HEYOOOOO');

      expect(board).to.have.property('_id');
      expect(board).to.have.property('strokes');
      console.log(client1.io.engine.id, client2.io.engine.id);
      done();
    });
  });

  // Test doesn't work.
  it('Should respond to "drag" events', function(done) {
    client2.on('join', function() {
      console.log('dragging');
      // console.log(client2.emit.toString());
      var x = 10;
      var y = 29;
      client2.emit('drag', [x, y]);
    });
    client1.on('drag', function(data) {
      console.log('FUCKIN HEARD IT YO');
      expect(data).to.be.instanceof(Object);
      expect(data).to.have.property('pen');
      expect(data).to.have.property('coords');
      client2.disconnect();
      done();
    });

  });

  it('Should respond to "end" events', function(done) {

    done();
  });
});
