var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
    fullname:
    {
        type: String,
        default: "user"
    }
});

// when you plugin passportLocalMongoose, it will add many useful 
// methods and fileds to User Schema (like username and password fields, so we
// don't have to specify them)
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);