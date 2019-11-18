//사용자 스키마

var mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

//schema
var userSchema = Schema({
    permission:{type:Number},
    id:{type:String, required:true},
    name:{type:String, required:true},
    password:{type:String, required:true},
    email:{type:String, required:true},
    phone:{type:String, required:true}
}, {
    toJSON: { virtuals: true},
    toObject: {virtuals: true}
});


userSchema.methods.generateHash = function(password) {
    return bcrypt.hash(password, 10); // return Promise
  };
  
  userSchema.methods.validatePassword = function(password) {
    if(!this.password){
      return false;
    }
    return bcrypt.compare(password, this.password); // return Promise
  };


// model export
var User=mongoose.model("user",userSchema);
module.exports = User;
