var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var logSchema  = new Schema({
    date: {type: Date, default: Date.now},
    name: String,
    code: String,
    wedding: Boolean,
    transportation: Boolean
}, { collection: 'log'});

module.exports = mongoose.model('log', logSchema);