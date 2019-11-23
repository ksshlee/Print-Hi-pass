//제본 스키마
var mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema
var accountschema = new mongoose.Schema({ // 1
    accountnumber:{type:Number},
    accountadmin:{type:String},
    accountbank:{type:String},
    adminplace:{type:String}
    },{
    toObject:{virtuals:true} // 4
  });

 

  //model export
  var Account =mongoose.model("account",accountschema);
  module.exports = Account;
