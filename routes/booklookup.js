var express = require('express');
var router = express.Router();
var Book=require("../models/Books");
var errorCatcher = require('../lib/async-error'); 

/* main page. */
router.get('/', async function(req, res, next) {
  var books = await Book.find();
  res.render('booklookup/index', {books:books});
});


//추후 관리자 권한 생성후 보완
//제본 추가 생성
router.get('/updatebook', function(req,res,next){
  res.render('booklookup/updatebook')
});






//추가생성된 값을 디비에 저장
var new_book
router.post('/',async function(req,res){
  console.log(req.body.title);//req.body를 못읽어옴!

  new_book = new Book({
    title : req.body.title,
    professor : req.body.professor,
    price : req.body.price,
    stock : req.body.stock
  });

  await new_book.save();

  console.log(new_book);

  req.flash('success', '제본 추가생성 완료');
  res.redirect('/booklookup')
});




module.exports = router;