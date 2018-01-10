const mongoose = require('mongoose')
//no req, cause Store is singleton in start.js....
const Store = mongoose.model('Store'); //get. set in models/Store.js



exports.homePage = (req,res) => {
  req.flash('error', 'Something happened.')
  req.flash('warning', 'Something happened.')
  req.flash('info', 'Something happened.')
  req.flash('success', 'Something happened.')
  res.render('index')
}
exports.addStore = (req,res) => {
  res.render('editStore', {title:'Add Store'})
}

exports.createStore = async (req,res) => {
  //res.json(req.body)
  // const store = new Store(req.body)
  // await store.save()
  const store = await (new Store(req.body)).save()
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`)
  res.redirect(`/store/${store.slug}`)  //slug happens in db, so need to get the store promised from db (with slug)
  // res.redirect('/')
  //no try/catch. using catchErrors() routes/index.js, instead
}




// exports.myMiddleware = (req,res,next) => {
//   req.foofy = 'barbie'
//   // throw new Error('Error intentionally thrown...')
//   next()
// }