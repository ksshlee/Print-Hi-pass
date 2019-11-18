var express = require('express');
var router = express.Router();
var Book=require("../models/Books");
var Rsv=require("../models/Reserve");
var errorCatcher = require('../lib/async-error'); 
var { isLoggedIn, isNotLoggedIn } = require('./middlewares');

/* main page. */
router.get('/',isLoggedIn,async function(req, res, next) {
  var books = await Book.find();
  res.render('booklookup/index', {books:books});
});


//추후 관리자 권한 생성후 보완
//제본 추가 생성
router.get('/updatebook',isLoggedIn, function(req,res,next){
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
    total_rsv : 0
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



// 여기에요!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


// router.post('/reserve:id', async function(req,res){
//   console.log('hi');

//   Book.findById(req.params.id, function(err, books){
//     // console.log(req.params.id);
//     // if (books.title != null){
//     Rsv.findById(books.title, function(err, rsvs){
//         console.log(rsvs);
//         let up_book = {_id:books._id};
//         let book={};


//         if (rsvs == null || (req.user.id != rsvs.uid)){
//           if (rsvs == null){
//             console.log("rsvs is null");
//           }
//           else{
//             console.log("new uid");
//           }
          
//         //  // req.flash('success', 'test');
//         //   new_rsv = new Rsv({
//         //     title : books.title,
//         //     professor : books.professor,
//         //     uid : req.user.id,
//         //     num_rsv : req.body.count
//         //   });
//         //   console.log(new_rsv);
//         //   new_rsv.save();

          
//         //   book.stock = books.stock - new_rsv.num_rsv;
//         //   book.total_rsv = books.total_rsv + new_rsv.num_rsv;
          
//         }



//         else{
//           let up_rsv = {_id:rsv._id};
//           let rsv={};
//           rsv.title = rsvs.title;
//           rsv.professor = rsvs.professor;
//           rsv.uid = rsvs.uid;
//           rsv.num_rsv = req.body.count;

//           Rsv.update(up_rsv, rsv, function(err){
//             if(err){
//               console.log(err);
//               return;
//             } else {
//               req.flash('success', '수정 완료!!');
//             }
//           });

//           book.stock = books.stock + rsvs.num_rsv - rsv.num_rsv;
//           book.total_rsv = books.total_rsv - rsvs.num_rsv + rsv.num_rsv;
//         }
//         // if (rsv != null && req.user.id != rsv.uid){
//           Book.update(up_book, book, function(err){
//             if(err){
//               console.log(err);
//               return;
//             } else {
//               req.flash('success', '예약 완료!!');
//             }
//           });

//           res.redirect('/booklookup');
//         // }
//       });   
//     // } 
//   });
  
    




//   //   if (books.uid == null || books.uid != req.params.id){
//   //     // req.flash('success', 'test');
//   //     if(books.num_rsv+Number(req.body.count)>books.stock){
//   //       req.flash('fail', '잔여량보다 더 많은 양을 예약했어용');
//   //       return res.render('booklookup/reserve', {books:books});
//   //     }
//   //     books.num_rsv = Number(req.body.count);
//   //     books.total_rsv += books.num_rsv;
//   //     console.log(books.num_rsv);
//   //     console.log(books.total_rsv);
      
//   //     //num_rsv를 업데이트하는 작업
//   //     book = new Book({
//   //       title : books.title,
//   //       professor : books.professor,
//   //       price : books.price,
//   //       stock : books.stock - books.total_rsv,
//   //       uid : req.params.id,
//   //       num_rsv : books.num_rsv,
//   //       total_rsv : books.total_rsv        
//   //     });

//   //     book.save();
//   //   }
//   //   else {
//   //     reserveBook(req.body, req.params.id, "update");
//   //   }

  
    
//   // var books = await Book.find();
//   // res.redirect('/booklookup');
// });


module.exports = router;