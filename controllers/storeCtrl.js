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

exports.editStore = async (req,res) => {
  //res.json(req.params)
  const store = await Store.findOne({_id:req.params._id})
  //TODO: confirm is owner of store
  res.render('storeEdit', {title:`Edit Store: ${store.name}`, store}) //store:store pre ES6
}

exports.updateStore = async (req,res) => {
  const store = await Store.findOneAndUpdate({_id:req.params._id}, req.body, {
    new:true,           //duh, actually return updated info
    runValidators:true  //duh, validate against Schema
  }).exec()  //query,data,options returns a query that needs to be executed.
  req.flash('success', `Successfully updated ${store.name}. <a href="/stores/${store.slug}">View Store</a>`)
  res.redirect(`/stores/${store._id}/edit`)  //slug happens in db, so need to get the store promised from db (with slug)
}









// exports.myMiddleware = (req,res,next) => {
//   req.foofy = 'barbie'
//   // throw new Error('Error intentionally thrown...')
//   next()
// }