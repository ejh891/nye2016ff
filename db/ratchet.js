var mongoose = require('mongoose');

var dbUser = process.env.DBUSER || "readonly";
var dbPass = process.env.DBPASS || "readonly";
mongoose.connect('mongodb://'+dbUser+':'+dbPass+'@ds133368.mlab.com:33368/ejh891_devdb');

var ratchetSchema = mongoose.Schema({
    url : String,
    rank : { type: Number, min: 0, max: 32 }
});

var Ratchet = mongoose.model('urls', ratchetSchema);

module.exports = Ratchet;