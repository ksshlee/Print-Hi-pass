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

  new_book = new Book({
    title : req.body.title,
    professor : req.body.professor,
    price : req.body.price,
    stock : req.body.stock,
    num_rsv : 0
  });

  await new_book.save();

  console.log(new_book);

  req.flash('success', '제본 추가생성 완료');
  res.redirect('/booklookup')
});



//제본예약 창
router.get('/reserve:id', function(req,res){
  Book.findById(req.params.id, function(err, books){
    return res.render('booklookup/reserve', {books:books});
  });
});

router.post('/reserve:id', async function(req,res){
  console.log('hi')
  Book.findById(req.params.id, function(err, books){
    console.log(typeof(books.num_rsv));
    books.num_rsv+=req.body.count;
    console.log(books.num_rsv);
    
    //num_rsv를 업데이트하는 작업
    let book={};
    book.num_rsv = books.num_rsv;
    let up_book = {_id:books._id};
    Book.update(up_book, book, function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', '예약 완료!!');
      }
    });
  });
  var books = await Book.find();
  res.render('booklookup/index', {books:books});
});


module.exports = router;