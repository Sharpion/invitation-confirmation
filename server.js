// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express     = require('express');        // call express
var app         = express();                 // define our app using express
var bodyParser  = require('body-parser');
var cors        = require('cors');
var dotenv      = require('dotenv');

dotenv.config();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); //Enable cross-origin requests

var port = process.env.PORT || 8080;        // set our port
var dbURI = process.env.MONGODB_URI;

var mongoose   = require('mongoose');
mongoose.connect(dbURI, { useNewUrlParser: true }); // connect to the database

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
    // get all confirmations
    // http://localhost:8080/api/confirmation/
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
    // get confirmations by code
    // http://localhost:8080/api/confirmation/:confirmation_id
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
    // update wedding and/or transportation confirmation
    // http://localhost:8080/api/confirm/{"id":"5cb7c782fb6fc041ab93314e","wedding":true,"transportation":false}
    .get(function(req, res) {
        const object = JSON.parse(req.params.object);
        Confirmation.findOneAndUpdate({_id: object._id}, {wedding: object.wedding, transportation: object.transportation}, {new:true}, function (err, ret) {
            if (err) {
                res.send(err);
                console.log("Error trying to update " + object._id);
            } else {
                res.json(ret);
            }
        });  
    });

router.route('/change')
    .get(function(req, res) {
        const object = JSON.parse(req.params.object);
        console.log(object);
        Log.populate(object, function(err, ret) {
            if (err) {
                res.send(err);
                console.log("Error trying to populate");
            } else {
                res.json(ret);
            }
        });
    });



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
var Confirmation     = require('./schema/confirmation');
var Log     = require('./schema/log');


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Open port: ' + port);