var express = require('express');
var router = express.Router();

/* main page. */
router.get('/', function(req, res, next) {
    res.render('booklookup/booklookup', { title: 'ph-1', message: 'Print Highpass number 1' });
  });
  
  /* manual page. */
  router.get('/manual', function(req,res,next){
    res.render('home/manual');
  });
  
  /*myongjin page. */
  router.get('/myongjin', function(req,res,next){
    res.render('home/myongjin');
  });
  
  /*5gong page. */
  router.get('/5gong', function(req,res,next){
    res.render('home/5gong');
  });
  
  module.exports = router;
  