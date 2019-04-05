var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/data', function(req, res, next) {
  res.send('This is all data');
});

router.get('/data/:id', function(req, res, next) {
  res.send(req.params);
});

router.post('/data', function(req, res, next) {
  res.send('Post example');
});

router.put('/data/:id', function(req, res, next) {
  res.send('Put info');
});

module.exports = router;
