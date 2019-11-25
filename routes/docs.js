// routes/docs.js
//models/Docs관련 백앤드
var express= require("express");
var router=express.Router();
var Doc=require("../models/Docs");
var { isLoggedIn, isNotLoggedIn, isAdmin} = require('./middlewares');
var multer = require('multer');
var errorCatcher = require('../lib/async-error'); 
var User = require('../models/Users');
var Account = require('../models/Account');

// node 구현
function Node(auth,content,colorchoice,direction,checkside,page,payment,count,sheetpage,time_frop){
  this.auth = auth;
  this.content = content;
  this.colorchoice = colorchoice;
  this.direction = direction;
  this.checkside = checkside;
  this.page = page;
  this.payment = payment;
  this.count = count;
  this.sheetpage = sheetpage;
  this.time_frop = time_frop
  this.next = null;
}

//linked list 구현
function LinkedList(){
  this.head = new Node("head");//처음 시작하는 노드
  this.find = find;
  this.append = append;
  this.insert = insert;
  this.remove = remove;
  this.toString = toString;
  this.findPrevious = findPrevious;
}

// 노드 찾기
function find(auth,time_frop) {
  var currNode = this.head;
  while(currNode.element != auth && currNode.element != time_frop) {
      currNode = currNode.next;
  }
  return currNode;
}


// 이전 노드 찾기
function findPrevious(auth,time_frop) {
  var currNode = this.head;
  while(currNode.next != null && currNode.next.element != auth && currNode.next.element != time_frop) {
      currNode = currNode.next;
  }
  return currNode;
}




 //노드 추가
 function append(auth,content,colorchoice,direction,checkside,page,payment,count,sheetpage,time_frop){
  var newNode = new Node(auth,content,colorchoice,direction,checkside,page,payment,count,sheetpage,time_frop);
  var current = this.head;
  while(current.next != null){
    current = current.next;
  }
  current.next = newNode;
 }

 //노드 중간삽입
function insert(auth,content,colorchoice,direction,checkside,page,payment,count,sheetpage,time_frop, auth,time_frop){
  var newNode = new Node(auth,content,colorchoice,direction,checkside,page,payment,count,sheetpage,time_frop);
  var current = this.find(auth,time_frop);//auth , timefrop 기준으로 찾기
  newNode.next = current.next;//새로운노드가 최근노드 다음을 가르킴
  current.next = newNode;
}


 //노드 삭제
 function remove(auth,time_frop){
   var preNode = this.findPrevious(auth,time_frop);//삭제할 노드 찾기
   preNode.next = preNode.next.next;//삭제할 노드 다음 노드를 가르킴
 }



//연결 리스트 요소들 출력
function toString() {
  var str = '[';
  var currNode = this.head;
  while(currNode.next != null){
    str += currNode.next.element+' ';
    currNode = currNode.next;
  }
  return str+']';
}





//저장소, 파일 이름 설정 // 파일 업로드 관련
const storage = multer.diskStorage({
   destination(req, file, callback) { 
     callback(null, 'uploads'); 
    }, 
    filename(req, file, callback) { 
      let array = file.originalname.split('.'); 
      array[0] = array[0] + '_'; 
      array[1] = '.' + array[1]; 
      array.splice(1, 0, Date.now().toString()); 
      const result = array.join(''); 
      console.log(result); 
      callback(null, result); 
    } 
  });

  const upload = multer({ 
    storage, 
    limits: { 
      files: 10, 
      fileSize: 1024 * 1024 * 1024, 
    } 
  });



//Index
router.get("/", isLoggedIn, async function(req, res, next) {
  key = req.query.key//키값 받아서 확인
  console.log(key)
  if (key == "5공학관"){
    title="welcome! 5공학관 인쇄실!"
  }
  else if (key == "명진당") {
    title="♥ 명진당 인쇄실입니다 ♥"
  }
  res.render("docs/index",{key:key});
});

// New
router.get("/new", isLoggedIn, function(req,res){
  key= req.query.key;
  res.render("docs/new",{key:key});
})


//pay
router.get("/pay", isLoggedIn, errorCatcher(async(req,res,next) => {
  console.log(key)
  var account = await Account.find({adminplace:req.query.key});
  console.log(account);
  payment = new_doc.payment
  res.render("docs/pay",{account:account, payment:payment, key:key});
}));


//savedoc
router.get("/savedoc",isLoggedIn,errorCatcher(async(req,res,next) => {
  key = req.query.key;
  if (new_doc){
    await new_doc.save();
  }
  res.redirect("/docs?key="+key);
}));


//board
router.get("/board",isLoggedIn,async function(req,res){
  
  //키값 확인
  key=req.query.key;
  
  var docs = await Doc.find({print_place:key}).sort({'time_frop': 1});
  //LinkedList = new LinkedList();
  //LinkedList.append(docs.author,docs.content,docs.colorchoice,docs.direction,docs.checkside,docs.page,docs.payment,docs.count,docs.sheetpage,docs.time_frop);
  //console.log(LinkedList)
  res.render("docs/board",{docs:docs, user:req.user});
})

function validCreateForm (form){
  // 글쓰기 폼 검사
  // 내용이랑 페이지수, 매수가 비어있으면 오류
  // 페이지 수, 매수 숫자 아니면 오류
  //var title = form.title || "";
 // var content = form.content || "";
  var page = form.page || "";
  var count = form.count || "";
  var time = form.time_frop || "";
  // if( !title ){
  //   return "제목을 입력하세요";
  // }

  // if( !content ){
  //   return "내용을 입력하세요";
  // }


  if( !page ){
    return "페이지수를 입력하세요";
  }
  else if (isNaN(page)){
    return "페이지수를 숫자로 입력하세요";
  }

  if( !count ){
    return "매수를 입력하세요";
  }
  else if (isNaN(count)){
    return "매수를 숫자로 입력하세요";
  }

  if (!time){
    return "예약할 시간을 선택하세요"
  }

  return null;
}

//create
var new_doc;
router.post("/", upload.array('photo',1), async function(req,res){
//파일 업로드
try { 
  const files = req.files; 
  let originalName = ''; 
  let fileName = ''; 
  let mimeType = ''; 
  let size = 0; 
  if (Array.isArray(files)) { 
    console.log(`files is array~`); 
    
    originalName = files[0].originalname; 
    fileName = files[0].filename;
    mimeType = files[0].mimetype; 
    size = files[0].size; 
  
  } else { 
    console.log(`files is not array~`); 
    originalName = files[0].originalname; 
    fileName = files[0].filename; 
    mimeType = files[0].mimetype; 
    size = files[0].size; 
  }
  
  console.log(`file inform : ${originalName}, ${fileName}, ${mimeType}, ${size}`); 
  
} catch (err) { 
  console.dir(err.stack); 
}

//파일 업로드 여기까지


  var err = validCreateForm(req.body);
  if (err){
    req.flash('danger', err);
    return res.redirect('back');
  }


  //총 가격 결제 알고리즘
  var total_pay = req.body.page * req.body.count;
  if (req.body.colorchoice == 'color'){
    total_pay = Math.ceil(total_pay/req.body.division) *100;
  }
  else {
    total_pay = Math.ceil(total_pay/req.body.division) *50;
  }

  console.log(Math.ceil(total_pay/req.body.division))
  
  
  console.log('---------------');
  console.log('게시판 글올린 body 확인');
  console.log(req.body);
  console.log('--------------');

  key = req.query.key//키값 받아서 확인





  //에러 없으면 디비에 저장
  new_doc = new Doc({
    auth : req.user._id,
    auth_id : req.user.id,
    content : req.body.content,
    colorchoice : req.body.colorchoice,
    direction : req.body.directionchoice,
    checkside : req.body.sidechoice,
    page : req.body.page,
    count : req.body.count,
    sheetpage : req.body.division,
    payment : total_pay,
    rsv_date : req.body.rsv_date,
    time_frop : req.body.time_frop,
    file_name : req.body.fileupload,
    print_place : key
  });
  console.log(new_doc);

  // var id;
  // User.findById(req.user._id, function(err, user){
  //   for(var i=0; i<user.count(); i++){
  //     if(req.user._id == user._id){
  //       id = user.id;
  //       break;
  //     }
  //   }
    
  //   console.log("id : " + id);
  // });

  //노드 추가
  // var LinkedList = new LinkedList();
  // LinkedList.append(req.session.user_id,req.body.content,req.body.colorchoice,req.body.directionchoice,req.body.sidechoice,req.body.page,total_pay,req.body.count,req.body.division,req.body.time_frop);
  

  req.flash('success', "글쓰기 성공");
  res.redirect("/docs/pay?key="+key);
  
});


// edit
router.get("/board/:id",isLoggedIn, function(req, res){
  Doc.findById(req.params.id, function(err, doc){
    // console.log(req.params.id);
    // console.log(doc.auth);
    // console.log(req.user._id);
    if(doc.auth != req.user._id){
      req.flash('danger', '잘못된 접근입니다!');
      return res.redirect('/docs/board');
    }
    return res.render('../views/docs/edit',  { doc:doc});
  });

});

//show
router.get("/show/:id",isLoggedIn, function(req,res){
  Doc.findById(req.params.id, function(err, doc){
    if(doc.auth != req.user._id){
      req.flash('danger', '잘못된 접근입니다!');
      return res.redirect('/docs/board');
    }
    return res.render('../views/docs/show',  { doc:doc});
  });

});


// edit
router.post('/board/:id', upload.array('photo',1),async function(req, res){
  console.log("enter editing");
  console.log(req.params.id);
  console.log(req.body);

  var err = validCreateForm(req.body);
  if (err){
    req.flash('danger', err);
    return res.redirect('back');
  }

  try { 
    const files = req.files; 
    let originalName = ''; 
    let fileName = ''; 
    let mimeType = ''; 
    let size = 0; 
    if (Array.isArray(files)) { 
      console.log(`files is array~`); 
      
      originalName = files[0].originalname; 
      fileName = files[0].filename;
      mimeType = files[0].mimetype; 
      size = files[0].size; 
    
    } else { 
      console.log('files is not array~'); 
      originalName = files[0].originalname; 
      fileName = files[0].filename; 
      mimeType = files[0].mimetype; 
      size = files[0].size; 
    }
    
    console.log(`file inform : ${originalName}, ${fileName}, ${mimeType}, ${size}`); 
    
  
  } catch (err) { 
    console.dir(err.stack); 
  }

  //총 가격 결제 알고리즘
  var total_pay = req.body.page * req.body.count;
  if (req.body.colorchoice == 'color'){
    total_pay = Math.ceil(total_pay/req.body.division) *100;
  }
  else {
    total_pay = Math.ceil(total_pay/req.body.division) *50;
  }

  let doc = {};
  doc.content = req.body.content;
  doc.colorchoice = req.body.colorchoice;
  doc.direction = req.body.directionchoice;
  doc.checkside = req.body.sidechoice;
  doc.page = req.body.page;
  doc.count = req.body.count;
  doc.sheetpage = req.body.division;
  doc.payment = total_pay;
  doc.rsv_date = req.body.rsv_date;
  doc.time_frop = req.body.time_frop;

  console.log(doc);

  let up_doc = {_id:req.params.id};

  Doc.update(up_doc, doc, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', '글 수정!');
      res.redirect('/docs/board');
    }
  });
});

//delete
router.get('/delete/:id', isAdmin, async function(req, res, next){
  await Doc.findByIdAndDelete(req.params.id);
  res.redirect('/docs/board');
});
  
module.exports = router;