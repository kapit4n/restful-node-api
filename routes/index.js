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

  let filter = req.query.$filter;

  let filterArr = {};
  if (filter) {
    filter = filter.replace('[', '');
    filter = filter.replace(']', '');
    filter = decodeURIComponent(filter);
    let conditions = filter.split('AND');
    conditions.forEach(element => {
      let conditionsSpl = element.split('IN');
      let field = conditionsSpl[0];
      field = field.replace(/'/g, "");
      field = field.trim();
      let fieldValues = conditionsSpl[1];
      fieldValues = fieldValues.replace(')', ']');
      fieldValues = fieldValues.replace('(', '[');
      fieldValues = fieldValues.replace(/'/g, '"');
      fieldValues = JSON.parse(fieldValues);
      filterArr[field] = fieldValues;
    });
  };


  let filterValues = {};
  filterValues['code'] = ["cd - 1000", "cd - 1010", "cd - 1020", "cd - 1030"];
  filterValues['address'] = ["Address 1", "Address 2"];

  let customers = [];
  let count = 1000;
  for (let i = 0; i < top; i++) {

    let nextValue = {
      id: i + skip,
      name: "Customer " + i + skip,
      code: "cd - " + (100 + i + skip),
      address: "Bolivia, Cochabamba, America St " + i + skip,
      budget: 10 * i
    };
    if (containsIn(nextValue, filterArr)) {
      customers.push(nextValue);
    }
  }

  res.send({
    count: count,
    value: customers,
    filterValues: filterValues
  });
});

function containsIn(el, fieldValues) {
  console.log(el);
  console.log(fieldValues);
  for (var k in el) {
    console.log(k);
    if (fieldValues[k]) {
      console.log(fieldValues[k]);
      let filtered = fieldValues[k].find(x => el[k] == x);
      console.log(filtered + "FILTERED");
      if (!filtered) {
        return false;
      }
    }
  }
  return true;
}

router.get('/data/:id', function (req, res, next) {
  res.send({
    id: req.params.id,
    name: "Customer " + req.params.id,
    code: "123",
    address: "Bolivia, Cochabamba, America St 1212",
    budget: 100
  });
});

router.post('/data', function (req, res, next) {
  console.log(req.body);
  res.send(req.body);
});

router.put('/data/:id', function (req, res, next) {
  console.log(req.body);
  res.send(req.body);
});

module.exports = router;