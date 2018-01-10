const mongoose = require('mongoose')
const Store = mongoose.model('Store'); //get from singleton in start.js. set in models/Store.js


exports.homePage = (req,res) => {
  res.render('index')
}
exports.addStore = (req,res) => {
  res.render('storeEdit', {title:'Add Store'})
}

exports.createStore = async (req,res) => {
  const store = await (new Store(req.body)).save()
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`)
  res.redirect(`/store/${store.slug}`)  //slug happens in db, so need to get the store promised from db (with slug)
  //no try/catch. using catchErrors() routes/index.js, instead; re:async/await
}

exports.getStores = async (req,res) => {
  const stores = await Store.find()  //console.log(stores)
  res.render('storeList', {title:'Store Listing', stores:stores})
}










// exports.myMiddleware = (req,res,next) => {
//   req.foofy = 'barbie'
//   // throw new Error('Error intentionally thrown...')
//   next()
// }