var mongoose = require('mongoose');
var keys = require('./mongokeys');

// Change for deployment
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1');
// mongoose.connect('mongodb://' + keys.user + ':'+ password +'@ds053194.mongolab.com:53194/heroku_gsfvkhxq');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'eonnection error:'));
db.once('open', function(cb) {
  console.log('connected');
});

module.exports = db;
