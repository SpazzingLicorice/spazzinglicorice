var mongoose = require('mongoose');

// Change for deployment
//process.env.MONGOLAB_URI || 'mongodb://127.0.0.1'
mongoose.connect(process.env.MONGOLAB_URI);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'eonnection error:'));
db.once('open', function(cb) {
  console.log('connected to db');
});

module.exports = db;

