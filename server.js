var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var morgan = require('morgan');

var Ratchet = require('./db/ratchet');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

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
        if (err) res.status(500).send(err);
        res.json({action: 'created', ratchet: ratchet});
    });
});

app.put('/api/ratchets/:ratchet_id', function(req, res) {
    Ratchet.findByIdAndUpdate(req.params.ratchet_id, {url: req.body.url, rank: req.body.rank}, function(err, ratchet) {
        if (err) res.status(500).send(err);
        res.json({action: 'updated', ratchet: ratchet});
    });
});

app.delete('/api/ratchets/:ratchet_id', function(req, res) {
    Ratchet.findByIdAndRemove(req.params.ratchet_id, function(err, ratchet) {
        if (err) res.send(500, err);
        res.json({action: 'deleted', ratchet: ratchet});
    });
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/views/index.html');
});

var basicAuthPass = process.env.BASICAUTHPASS || "";
app.get('/manage', function(req, res) {
    var auth = req.headers['authorization'];  // auth is in base64(username:password)  so we need to decode the base64
    console.log("Authorization Header is: ", auth);

    if(!auth) { // No Authorization header was passed in so it's the first time the browser hit us
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.end('<html><body>Need some creds son</body></html>');
    }
    else if(auth) {    // The Authorization was passed in so now we validate it
        var tmp = auth.split(' ');   // Split on a space, the original auth looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part

        var buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
        var plain_auth = buf.toString();        // read it back out as a string

        console.log("Decoded Authorization ", plain_auth);

        // At this point plain_auth = "username:password"
        var creds = plain_auth.split(':');      // split on a ':'
        var username = creds[0];
        var password = creds[1];

        if(password === basicAuthPass) {   // Is the username/password correct?
            res.sendFile(__dirname + '/public/views/manage.html');
        }
        else {
            res.statusCode = 401; // Force them to retry authentication
            res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
            res.end('<html><body>You shall not pass</body></html>');
        }
    }
});

app.get('/litCheck', function(req, res) {
    res.sendFile(__dirname + '/public/views/litCheck.html');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('listening on ' + port);
});