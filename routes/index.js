const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  console.log('Route: "/"')
  res.send('Hey! It works!');
  // const obj = {a:1, b:2, c:3}
  // console.log(obj)
  // res.json(obj) 
  // res.json(req.query)
  // res.send(req.query.foo)   //http://localhost:7777/?foo=bar
  // res.json(req.body)
});

router.get('/reverse/:thestr', (req, res) => {
  console.log('Route: "/reverse/:thestr"')
  // res.json(req.params)
  res.send([...req.params.thestr].reverse().join(''))   //http://localhost:7777/reverse/shazbot
});



module.exports = router;
