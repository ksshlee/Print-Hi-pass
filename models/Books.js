//models Books.js
//제본 관련 백엔드
var mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema
var bookSchema = new mongoose.Schema({ // 1
    title:{type:String},
    professor:{type:String},
    price:{type:Number},
    stock:{type:Number},
    num_rsv:{type:Number}
  },{
    toObject:{virtuals:true} // 4
  });
 

  //model export

  var Book =mongoose.model("booklookup",bookSchema);
  module.exports = Book;
