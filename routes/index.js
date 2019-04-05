var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/data', function (req, res, next) {
  res.send([{
    id: 1,
    name: "Customer 1",
    code: 123,
    address: "Bolivia, Cochabamba, America St 1212",
    budget: 100
  }, {
    id: 2,
    name: "Customer 2",
    code: 123,
    address: "Bolivia, Cochabamba, America St 1212",
    budget: 100
  }]);
});

router.get('/data/:id', function (req, res, next) {
  res.send({
    id: req.params.id,
    name: "Customer " + req.params.id,
    code: 123,
    address: "Bolivia, Cochabamba, America St 1212",
    budget: 100
  });
});

router.post('/data', function (req, res, next) {
  res.send('Post example');
});

router.put('/data/:id', function (req, res, next) {
  res.send('Put info');
});

module.exports = router;