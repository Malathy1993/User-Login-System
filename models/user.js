var mongoose = require('mongoose')
const bcrypt = require('bcrypt');
mongoose.connect("mongodb://localhost:27017/nodeauth")

 var db = mongoose.connection;

// User Schema
var userSchema = mongoose.Schema({
    username : {
        type : String,
    },
    password : {
        type : String
    },
    email : {
        type : String
    },
    name : {
        type : String
    },
    profileImage : {
        type : String
    }
});

var User = module.exports = mongoose.model('User',userSchema);



module.exports.getUserByUsername = function(username, callback){
    var query = { username: username };
    User.findOne(query,callback);

}

module.exports.getUserById = function(id, callback){
    User.findById(id,callback);

}

module.exports.comparepassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err,isMatch){
        if (err) throw callback(err);
        callback(null, isMatch);
    });
}

module.exports.createUser = function(newUser,callback){
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}

// module.exports.createUser = function(newUser,callback){
//     bcrypt.hash(newUser,10,function(err,hash){
//         console.log("createUser");
        
//         if(err) throw err;
//         newUser.password = hash;
//         newUser.save(callback);
//     })
// }