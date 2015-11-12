var mongoose = require('mongoose');
var db = require('./config');

var boardSchema = new mongoose.Schema({
  id: String,
  lines: Object
});

var Board = new mongoose.model('board', boardSchema);

module.exports.schema = boardSchema;
module.exports.model = Board;