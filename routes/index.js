var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/data/', function (req, res, next) {

  let top = req.query.$top ? req.query.$top: 10;
  let skip = req.query.$skip ? req.query.$skip : 0;

  console.log(top);
  console.log(skip);
  let customers = [];
  let count = 1000;
  for (let i = 0; i < top; i++) {
    customers.push({
      id: i + skip,
      name: "Customer " + i + skip,
      code: 123,
      address: "Bolivia, Cochabamba, America St " + i + skip,
      budget: 10 * i
    });
  }

  res.send({
    count: count,
    value: customers
  });
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