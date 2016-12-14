var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var morgan = require('morgan');

var Ratchet = require('./db/ratchet');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('listening on ' + port);
});

app.get('/api/ratchets', function(req, res) {
    Ratchet.find(function(err, results) {
        if (err) res.send(500, err);
        res.json(results);
    });
});

app.post('/api/ratchets', function(req, res) {
    console.log(req.body);
    var newRatchet = new Ratchet({
        url: req.body.url,
        rank: req.body.rank
    });

    Ratchet.create(newRatchet, function(err, ratchet) {
        if (err) res.send(500, err);
        res.json({action: 'created', ratchet: ratchet});
    });
});

app.delete('/api/ratchets/:ratchet_id', function(req, res) {
    Ratchet.remove({_id: req.params.ratchet_id}, function(err, ratchet) {
        if (err) res.send(500, err);
        res.json({action: 'deleted', ratchet: ratchet});
    });
});