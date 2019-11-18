//게시판 스키마

var mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema
var docsSchema = Schema({ // 1
    auth:{type:String},
    content:{type:String},
    colorchoice:{type:String},
    direction:{type:String},
    checkside:{type:String},
    page:{type:Number, required:true},
    count:{type:Number, required:true},
    payment:{type:Number},
    sheetpage:{type:Number},
    rsv_date:{type:String},
    time_frop:{type:String},
    file_name:{type:String}

  },{
    toObject:{virtuals:true} // 4
  });
  

  var Doc =mongoose.model("docs",docsSchema);
  module.exports  = Doc;