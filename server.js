// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express     = require('express');        // call express
var app         = express();                 // define our app using express
var bodyParser  = require('body-parser');
var cors        = require('cors');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); //Enable cross-origin requests

var port = process.env.PORT || 8080;        // set our port
var dbURI = process.env.MONGODB_URI;

var mongoose   = require('mongoose');
mongoose.connect(dbURI); // connect to the database

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
	console.log('Mongoose default connection open to ' + dbURI);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
	console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
	console.log('Mongoose default connection disconnected'); 
});


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    console.log('Request received...');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'API app is up and running' });   
});


// on routes that end in /confirmation
// ----------------------------------------------------
router.route('/confirmation')
    .get(function(req, res) {
        Confirmation.find(function(err, ret) {
            if (err) {
                res.send(err);
                console.log("Error trying to find");
            }
          
            res.json(ret);
        }).sort({name: -1})
    });

router.route('/confirmation/:code')
    // get the confirmation with that id (accessed at GET http://localhost:8080/api/confirmations/:confirmation_id)
    .get(function(req, res) {
        let code = req.params.code;
        Confirmation.find({code: code}, function(err, ret) {
            if (err) {
                res.send(err);
                console.log("Error trying to find by code");
            }
            res.json(ret);
        });
    });
router.route('/confirm/:object')
    .get(function(req) {
        let object = req.params.object;
        console.log(object);

        Confirmation.updateOne({ id: ObjectID(object.id)}, {$set: {wedding: object.wedding, transportation: object.transportation}}, function (err, ret) {
            console.log(ret.n);
            console.log(ret.nModified);
            return ret.nModified;
        });        
    });



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
var Confirmation     = require('./schema/confirmation');

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Open port: ' + port);