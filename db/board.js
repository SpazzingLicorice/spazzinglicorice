var mongoose = require('mongoose');
var db = require('./config');

var boardSchema = new mongoose.Schema({
  id: String,
  strokes: Array
});

// var strokeSchema = new mongoose.Schema({
//   fillStyle: String,
//   strokeStyle: String,
//   lineWidth: Number,
//   lineCap: String,
//   path: Array
// });

var Board = new mongoose.model('board', boardSchema);
// var Stroke = new mongoose.model('stroke', strokeSchema);

module.exports.boardModel = Board;
// module.exports.strokeModel = Stroke;