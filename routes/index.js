const express = require('express');
const router = express.Router();
const storeCtrl = require('../controllers/storeCtrl')
const {catchErrors} = require('../handlers/errorHandlers')


// router.get('/', storeCtrl.homePage)
router.get('/', catchErrors(storeCtrl.getStores))
router.get('/stores', catchErrors(storeCtrl.getStores))
router.get('/add', storeCtrl.addStore)
router.post('/add', catchErrors(storeCtrl.createStore))
router.post('/add/:_id', catchErrors(storeCtrl.updateStore))
router.get('/stores/:_id/edit', catchErrors(storeCtrl.editStore))





// router.get('/', storeCtrl.myMiddleware, storeCtrl.homePage)

// // Do work here
// router.get('/', (req, res) => {
//   console.log('Route: "/"')
//   //res.send('Hey! It works!!!');
//   res.render('hello', {name:'ZAP', dog:'Willy', time:req.query.time, timestamp:Date.now()})
// });

// router.get('/reverse/:thestr', (req, res) => {
//   console.log('Route: "/reverse/:thestr"')
//   // res.json(req.params)
//   res.send([...req.params.thestr].reverse().join(''))   //http://localhost:7777/reverse/shazbot
// });



module.exports = router;
