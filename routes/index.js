const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  console.log('Route: "/"')
  //res.send('Hey! It works!!!');
  res.render('hello', {name:'ZAP', dog:'Willy', time:req.query.time, timestamp:Date.now()})
});

router.get('/reverse/:thestr', (req, res) => {
  console.log('Route: "/reverse/:thestr"')
  // res.json(req.params)
  res.send([...req.params.thestr].reverse().join(''))   //http://localhost:7777/reverse/shazbot
});



module.exports = router;
