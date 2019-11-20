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


function validBookForm (form){
  var place = form.place || "";
  var title = form.title || "";
  var professor = form.professor || "";
  var price = form.price || 0;
  var stock = form.stock || 0;

  if( !place ){
    return "인쇄실을 입력하세요";
  }

  if( !title ){
    return "제본 이름을 입력하세요";
  }

  if( !professor ){
    return "교수님 성함을 입력하세요";
  }

  if( price == 0 ){
    return "가격을 입력하세요";
  }

  if( stock == 0 ){
    return "재고를 입력하세요";
  }
}


//추가생성된 값을 디비에 저장
var new_book
router.post('/',isLoggedIn, async function(req,res){
  var err = validBookForm(req.body);
  if(err){
    req.flash('danger', err);
    return res.redirect('back'); 
  }

  var isDup = await Book.findOne({
    place : req.body.place,
    title : req.body.title,
    professor : req.body.professor
  });
  if (isDup){
    req.flash('danger', "중복된 제본이 있습니다.");
    return res.redirect('back');
  }


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


//제본예약
router.get('/reserve:id',isLoggedIn, function(req,res){
  Book.findById(req.params.id, function(err, books){
    return res.render('booklookup/reserve', {books:books});
  });
});


//제본예약
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


//제본 수정 관리자한테만
router.get('/modify:id', isAdmin, async function(req, res, next){
  Book.findById(req.params.id, function(err, book){
    return res.render('../views/booklookup/modifybook',  { book:book});
  });
});


// 제본 수정 관리자한테만
router.post('/modify:id', async function(req, res){
  console.log("enter editing");
  console.log(req.params.id);
  console.log(req.body);

  var err = validBookForm(req.body);
  if (err){
    req.flash('danger', err);
    return res.redirect('back');
  }


  let book = {};
  book.place = req.body.place;
  book.title = req.body.title;
  book.professor = req.body.professor;
  book.price = req.body.price;
  book.stock = req.body.stock;
  

  console.log(book);

  let up_book = {_id:req.params.id};

  Book.update(up_book, book, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', '제본 수정!');
      res.redirect('/booklookup');
    }
  });
});


//제본 삭제 관리자한테만
router.get('/delete:id', isAdmin, async function(req, res, next){
  await Book.findByIdAndDelete(req.params.id);
  res.redirect('/booklookup');
});





//제본검색
router.post('/search', async function(req,res,next){
  console.log('hi')
  var books = await Book.find({title:req.body.search})
  if (books == null){
    req.flash('danger','검색하신 책 제목이 없습니다');
    return res.redirect('/booklookup');
  }
  console.log(books);
  res.render('booklookup/searchresult', {books:books, user:req.user});
});





module.exports = router;