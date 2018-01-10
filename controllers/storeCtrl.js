const mongoose = require('mongoose')
//no req, cause Store is singleton in start.js....
const Store = mongoose.model('Store'); //get. set in models/Store.js



exports.homePage = (req,res) => {
  // console.log(req.foofy)
  res.render('index')
}
exports.addStore = (req,res) => {
  res.render('editStore', {title:'Add Store'})
}
exports.createStore = async (req,res) => {
  //res.json(req.body)
  const store = new Store(req.body)
  store.coolness = 'totallytastic'

  // store.save(function(err,store) {...})    //old callback hell era
  // store.save()                             //promises era
  //   .then(store => res.json(store))
  //   .catch(err => {throw new Error(err)})

  await store.save()                          //async/await
  console.log('Store saved.')
  res.redirect('/')
  //would need to wrap all this in try/catch to catch errors, 
  //OR...
  //wrap entire createStore fn with catchErrors() in handlers/errorhandlers(!)
  //this is done (wrapped) in routes/index.js.
  //note how app.js has "app.use('/', routes)", followed by middleware errorhandling.
  //dunno if I like this
}




// exports.myMiddleware = (req,res,next) => {
//   req.foofy = 'barbie'
//   // throw new Error('Error intentionally thrown...')
//   next()
// }