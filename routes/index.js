var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

var allData = [];
var allDataCount = 1000;
for (let i = 0; i < allDataCount; i++) {
  let nextNumber = i  % 10;
  let nextCodeNumber = i  % 7;
  let nextAddressNumber = i  % 8;
  let nextValue = {
    id: i,
    name: "Customer " + nextNumber,
    code: "cd - " + (100 + nextCodeNumber ),
    address: "Bolivia, Am St " + nextAddressNumber,
    budget: 10 * i
  };
  allData.push(nextValue);
}

var filterValues = {};
filterValues['code'] = [...Array(7).keys()].map(x => "cd - " + (100 + x) );
filterValues['address'] = [...Array(8).keys()].map(x => "Bolivia, Am St " + x );
filterValues['name'] = [...Array(10).keys()].map(x => "Customer " + (x) );

router.get('/data/', function (req, res, next) {

  let top = req.query.$top ? parseInt(req.query.$top): 10;
  let skip = req.query.$skip ? parseInt(req.query.$skip) : 0;

  let filter = req.query.$filter;

  let filterArr = {};
  if (filter) {
    filter = filter.replace(/\[/g, "");
    filter = filter.replace(/\]/g, "");
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

  let customers = [];
  let i = 0;
  let limitSearch = allData.length;
  while ( i < limitSearch) {
    let nextValue = allData[i];
    if (containsIn(nextValue, filterArr)) {
      customers.push(nextValue);
    }
    i++;
  }

  if (req.query.$orderby) {
    let sortFiltersParam = req.query.$orderby;
    sortFiltersParam = decodeURIComponent(sortFiltersParam);

    sortFiltersParam = sortFiltersParam.split("AND");

    let keyValSort = {};

    sortFiltersParam.forEach(x => {
      let keyVal = x.trim().split(" ");
      keyValSort[keyVal[0]] = keyVal[1];
    });

    customers.sort((x, y) => {
      let res = 0;
      for(var k in keyValSort) {
        res = x[k].localeCompare(y[k]);
        if (res != 0) {
          break;
        }
      }
      return res;
    });
    if (req.query.$orderby.includes("desc")) {
      customers.reverse();
    }
  }

  res.send({
    count: customers.length,
    value: customers.slice(skip, skip + top),
    filterValues: filterValues
  });
});

function containsIn(el, fieldValues) {
  for (var k in el) {
    if (fieldValues[k]) {
      let filtered = fieldValues[k].find(x => el[k] == x);
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
  let nextId = allData.length;
  let nextValue = req.body;
  nextValue.id = nextId;
  allData.push(nextValue);
  insertFilter(nextValue.name, filterValues['name']);
  insertFilter(nextValue.code, filterValues['code']);
  insertFilter(nextValue.address, filterValues['address']);
  res.send(nextValue);
});

function insertFilter(fil, filters){
  let found = filters.find(x => x == fil);
  if (!found) {
    filters.push(fil);
  }
}
router.put('/data/:id', function (req, res, next) {
  let found = allData.find(x => x.id = req.body.id);
  found.name = req.body.name;
  found.code = req.body.code;
  found.name = req.body.name;
  found.address = req.body.address;

  insertFilter(found.name, filterValues['name']);
  insertFilter(found.code, filterValues['code']);
  insertFilter(found.address, filterValues['address']);
  

  res.send(found);
});

module.exports = router;