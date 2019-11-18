//models Books.js
//제본 관련 백엔드
var mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema
var reserveSchema = new Schema({ // 1
    title:{type:String},
    professor:{type:String},
    uid:{type:String},
    num_rsv:{type:Number}
  },{
    toObject:{virtuals:true} // 4
  });
 

  //model export

  var Reserve =mongoose.model("reserve",reserveSchema);
  module.exports = Reserve;
