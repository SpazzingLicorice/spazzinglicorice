// # Mongoose Board Model & Schema
var mongoose = require('mongoose');
var db = require('./config');

var boardSchema = new mongoose.Schema({
  id: String,
  strokes: Array
});

var Board = mongoose.model('board', boardSchema);

// Required by [Server](../docs/server.html) & [Socket Connection Handler](../docs/sockets.html)
module.exports.boardModel = Board;
