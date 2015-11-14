/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mongoose = require('mongoose');
var request = require("request"); // You might need to npm install the request module!
var expect = require('chai').expect;
var Board = require('../db/board').boardModel;

describe("Persistent Boards Server", function() {

  beforeEach(function(done) {
    var db = mongoose.createConnection('mongodb://127.0.0.1');

    var db = mongoose.connection;
    var board = db.model('board');
    var newBoard = board({strokes: []});

    console.log(newBoard);
    newBoard.save(function() {
      console.log('hello')
      done();
    });
    // done();
  });

  afterEach(function() {
    // dbConnection.end();
  });

  it("Should pass", function(done) {
    done();
  })

  // it("Should insert posted messages to the DB", function(done) {
  //   // Post the user to the chat server.
  //   request({ method: "POST",
  //             uri: "http://127.0.0.1:3000/classes/users",
  //             json: { username: "Valjean" }
  //   }, function () {
  //     // Post a message to the node chat server:
  //     request({ method: "POST",
  //             uri: "http://127.0.0.1:3000/classes/messages",
  //             json: {
  //               username: "Valjean",
  //               message: "In mercy's name, three days is all I need.",
  //               roomname: "Hello"
  //             }
  //     }, function () {
  //       // Now if we look in the database, we should find the
  //       // posted message there.

  //       // TODO: You might have to change this test to get all the data from
  //       // your message table, since this is schema-dependent.
  //       var queryString = "SELECT * FROM messages";
  //       var queryArgs = [];

  //       dbConnection.query(queryString, queryArgs, function(err, results) {
  //         // Should have one result:
  //         expect(results.length).to.equal(1);

  //         // TODO: If you don't have a column named text, change this test.
  //         expect(results[0].message).to.equal("In mercy's name, three days is all I need.");

  //         done();
  //       });
  //     });
  //   });
  // });

  // it("Should output all messages from the DB", function(done) {
  //   // Let's insert a message into the db
  //   var tablename = "messages";
  //   // TODO - The exact query string and query args to use
  //   // here depend on the schema you design, so I'll leave
  //   // them up to you. */
  //   request({ method: "POST",
  //             uri: "http://127.0.0.1:3000/classes/messages",
  //             json: {
  //               username: "Javert",
  //               message: "Men like you can never change!"
  //             }},
  //   function() {
  //     var queryString = "SELECT * FROM messages";
  //     var queryArgs = [];

  //     dbConnection.query(queryString, queryArgs, function(err) {
  //       console.log('go');
  //       if (err) { console.log('er'); throw err; }

  //       // Now query the Node chat server and see if it returns
  //       // the message we just inserted:
  //       request("http://127.0.0.1:3000/classes/messages", function(error, response, body) {
  //         console.log('body', body);
  //         var messageLog = JSON.parse(body);
  //         expect(messageLog[0].message).to.equal("Men like you can never change!");
  //         expect(messageLog[0].roomName).to.equal("General");
  //         done();
  //       });
  //     });
  //   });
  // });
});