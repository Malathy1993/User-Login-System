var express = require('express');
var router = express.Router();

/* GET Register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});
/* GET Register page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});


module.exports = router;
