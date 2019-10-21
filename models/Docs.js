//models Docs.js
//게시판 형식 관련 백엔드 js

var mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema
var docsSchema = Schema({ // 1
  // body -> content
    //title:{type:String, required:true},
    auth:{type:Schema.Types.ObjectId, ref: 'User'},
    content:{type:String},
    colorchoice:{type:String},
    direction:{type:String},
    checkside:{type:String},
    page:{type:Number, required:true},
    count:{type:Number, required:true},
    payment:{type:Number},
    // createdAt:{type:Date, default:Date.now}, // 2
    // updatedAt:{type:Date},
    time_frop:{type:String}

  },{
    toObject:{virtuals:true} // 4
  });
  
  // // virtuals // 3
  // postSchema.virtual("createdDate")
  // .get(function(){
  //   return getDate(this.createdAt);
  // });
  
  // postSchema.virtual("createdTime")
  // .get(function(){
  //   return getTime(this.createdAt);
  // });
  
  // postSchema.virtual("updatedDate")
  // .get(function(){
  //   return getDate(this.updatedAt);
  // });
  
  // postSchema.virtual("updatedTime")
  // .get(function(){
  //   return getTime(this.updatedAt);
  // });


  //model export

  var Doc =mongoose.model("docs",docsSchema);
  module.exports  = Doc;


  // //functions
  // function getDate(dateObj){
  //   if(dateObj instanceof Date)
  //     return dateObj.getFullYear() + "-" + get2digits(dateObj.getMonth()+1)+ "-" + get2digits(dateObj.getDate());
  // }
  
  // function getTime(dateObj){
  //   if(dateObj instanceof Date)
  //     return get2digits(dateObj.getHours()) + ":" + get2digits(dateObj.getMinutes())+ ":" + get2digits(dateObj.getSeconds());
  // }
  
  // function get2digits(num){
  //   return ("0" + num).slice(-2);
  // }