////routes/index.js...
const express = require('express');
const router = express.Router();
const storeCtrl = require('../controllers/storeCtrl')
const userCtrl  = require('../controllers/userCtrl')
const authCtrl  = require('../controllers/authCtrl')
const {catchErrors} = require('../handlers/errorHandlers')


// router.get('/', storeCtrl.homePage)
router.get('/', catchErrors(storeCtrl.getStores))
router.get('/stores', catchErrors(storeCtrl.getStores))
router.get('/add', storeCtrl.addStore)
// router.post('/add', catchErrors(storeCtrl.createStore))
router.post('/add', 
  storeCtrl.upload,
  catchErrors(storeCtrl.resize),
  catchErrors(storeCtrl.createStore)
)
// router.post('/add/:_id', catchErrors(storeCtrl.updateStore))
router.post('/add/:_id', 
  storeCtrl.upload,
  catchErrors(storeCtrl.resize),
  catchErrors(storeCtrl.updateStore)
)
router.get('/stores/:_id/edit', catchErrors(storeCtrl.editStore))
router.get('/store/:slug', catchErrors(storeCtrl.viewStore))

router.get('/tags',       catchErrors(storeCtrl.getStoresByTag))
router.get('/tags/:tag',  catchErrors(storeCtrl.getStoresByTag))

router.get('/login',       userCtrl.loginForm)
router.get('/register',    userCtrl.registerForm)

//1. validate registration data (create validateRegister middleware in userCtrl.js)
//2. register user (create)
//3. log them in (authenticate)
router.post('/register',   
  userCtrl.validateRegister,
  userCtrl.register,
  authCtrl.login
)












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
