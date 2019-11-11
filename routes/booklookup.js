var express = require('express');
var router = express.Router();

/* main page. */
router.get('/', function(req, res, next) {
    res.render('booklookup/booklookup', { title: 'ph-1', message: 'Print Highpass number 1' });
  });


module.exports = router; 