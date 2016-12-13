var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var dbUser = process.env.DBUSER || "readonly";
var dbPass = process.env.DBPASS || "readonly";
mongoose.connect('mongodb://'+dbUser+':'+dbPass+'@ds133368.mlab.com:33368/ejh891_devdb');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('listening on ' + port);
});

var ratchetSchema = mongoose.Schema({
    url : String,
    rank : { type: Number, min: 0, max: 32 }
});

var ratchetCollection = mongoose.model('urls', ratchetSchema);

app.get('/api/ratchetImages', function(req, res) {
    ratchetCollection.find(function(err, results) {
        if (err) res.send(500, err);
        res.json(results);
    });
});