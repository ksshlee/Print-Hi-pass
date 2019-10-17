// routes/posts.js
//models/Post관련 백앤드

var express= require("express");
var router=express.Router();
var Post=require("../models/Post");
var { isLoggedIn, isNotLoggedIn } = require('./middlewares');

//Index

router.get("/", isLoggedIn, async function(req, res) {
  var posts = await Post.find();
    // Post.find({})
    // .sort("-createdAt")
    // .exec(function(err,posts){
    //     if(err)return  res.json(err);
    //     
    // });
    console.log(posts);
    res.render("posts/index",{posts:posts});
});

// New
router.get("/new",function(req,res){
    res.render("posts/new");
})


function validCreateForm (form){
  // 글쓰기 폼 검사
  // 제목이랑 내용이 비어있으면 오류
  var title = form.title || "";
  var content = form.content || "";

  if( !title ){
    return "제목을 입력하세요";
  }

  if( !content ){
    return "내용을 입력하세요";
  }

  return null;
}

//create
router.post("/", async function(req,res){
  // console.log(req.body);

  // await new_post.save(function(err, data){
  //   if(err){
  //     res.redirect("/posts");
  //   }
  // });
  // res.redirect("/posts");

  var err = validCreateForm(req.body);
  if (err){
    req.flash('danger', err);
    return res.redirect('back');
  }

  var color = (req.body.allblack == 'on') ? 'on' : 'off' ; 
  //만약 color가 off 일때는 off 출력 on일때는 on 출력하는 상방향 연산자????! 암튼 그거임
  var side = (req.body.double_side == 'on') ? 'on' : 'off' ;

  //에러 없으면 디비에 저장
  var new_post = new Post({
    title : req.body.title,
    content : req.body.content,
    allblack : color,
    double_side : side
  });

  await new_post.save();
  req.flash('success', "글쓰기 성공");
  res.redirect("/posts");

});


// // show
// router.get("/:id", function(req, res){
//     Post.findOne({_id:req.params.id}, function(err, post){
//       if(err) return res.json(err);
//       res.render("posts/show", {post:post});
//     });
//   });
  
//   // edit
//   router.get("/:id/edit", function(req, res){
//     Post.findOne({_id:req.params.id}, function(err, post){
//       if(err) return res.json(err);
//       res.render("posts/edit", {post:post});
//     });
//   });
  
//   // update
//   router.put("/:id", function(req, res){
//     req.body.updatedAt = Date.now(); // 2
//     Post.findOneAndUpdate({_id:req.params.id}, req.body, function(err, post){
//       if(err) return res.json(err);
//       res.redirect("/posts/"+req.params.id);
//     });
//   });
  
//   // destroy
//   router.delete("/:id", function(req, res){
//     Post.deleteOne({_id:req.params.id}, function(err){
//       if(err) return res.json(err);
//       res.redirect("/posts");
//     });
//   });
  
  module.exports = router;
  