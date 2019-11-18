var express = require('express');
var router = express.Router();
var Book=require("../models/Books");
var errorCatcher = require('../lib/async-error'); 
var { isLoggedIn, isNotLoggedIn, isAdmin} = require('./middlewares');

/* main page. */
router.get('/',isLoggedIn,async function(req, res, next) {
  var books = await Book.find();
  res.render('booklookup/index', {books:books, user:req.user});
});


//제본 추가 생성
router.get('/updatebook',isAdmin, function(req,res,next){
  res.render('booklookup/updatebook')
});


//추가생성된 값을 디비에 저장
var new_book
router.post('/',isLoggedIn, async function(req,res){
  new_book = new Book({
    place : req.body.place,
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
router.get('/reserve:id',isLoggedIn, function(req,res){
  Book.findById(req.params.id, function(err, books){
    return res.render('booklookup/reserve', {books:books});
  });
});

router.post('/reserve:id',isLoggedIn, async function(req,res){
  console.log('hi')
  console.log(req.params)
  Book.findById(req.params.id, function(err, books){
    if(books.num_rsv+Number(req.body.count)>books.stock){
      req.flash('fail', '잔여량보다 더 많은 양을 예약했어용');
      return res.render('booklookup/reserve', {books:books});
    }
    books.num_rsv+=Number(req.body.count);
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
  res.redirect('/booklookup');
});


//제본 삭제 관리자한테만
router.get('/delete:id', isAdmin, async function(req, res, next){
  await Book.findByIdAndDelete(req.params.id);
  res.redirect('/booklookup');
});



module.exports = router;