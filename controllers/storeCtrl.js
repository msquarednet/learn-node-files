const mongoose = require('mongoose')
const Store = mongoose.model('Store'); //get from singleton in start.js. set in models/Store.js
const multer = require('multer')
const jimp = require('jimp')
const uuid = require('uuid')

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter: (req,file,next) => {
    const isPhoto = file.mimetype.startsWith('image/')
    if (isPhoto) {next(null,true)}  //null is for error
    else {next({message: 'That filetype is NOT allowed.'},false)}
  }
}


exports.homePage = (req,res) => {
  res.render('index')
}
exports.addStore = (req,res) => {
  res.render('storeEdit', {title:'Add Store'})
}

//step 1
exports.upload = multer(multerOptions).single('photo')
//step 2
exports.resize = async (req,res,next) => {
  if (!req.file) {next(); return;}
  console.log(req.file)
  const ext = req.file.mimetype.split('/')[1]
  req.body.photo = `${uuid.v4()}.${ext}` //pass along to next middleware
  const photo = await jimp.read(req.file.buffer)
  await photo.resize(800,jimp.AUTO)
  await photo.write(`./public/uploads/${req.body.photo}`)
  next()
}
//step 3
exports.createStore = async (req,res) => {
  req.body.author = req.user._id
  const store = await (new Store(req.body)).save()
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`)
  res.redirect(`/store/${store.slug}`)  //slug happens in db, so need to get the store promised from db (with slug)
  //no try/catch. using catchErrors() routes/index.js, instead; re:async/await
}
exports.getStores = async (req,res) => {
  const stores = await Store.find()  //console.log(stores)
  res.render('storeList', {title:'Store Listing', stores:stores})
}

const confirmOwner = (store, user) => {
  // console.log(store.author, user._id) //ObjectID, String
  // console.log(store.author.toString() === user._id.toString())
  if (!store.author) {
    throw Error('No author? NO EDITING!.')
  } else if (!store.author.equals(user._id)) {
    throw Error('You must own a store to edit it.')
  }
}

exports.editStore = async (req,res) => {
  //res.json(req.params)
  const store = await Store.findOne({_id:req.params._id})
  //TODO: confirm is owner of store
  confirmOwner(store, req.user) //middleware instead?
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


exports.viewStore = async (req,res,next) => { //getStoreBySlug
  //res.json(req.params)
  const store = await Store.findOne({slug:req.params.slug}).populate('author')  
  //populate :)
  if (!store) {return next()} //invalid slug
  res.render('storeView', {store:store}) //old school :)
}

exports.getStoresByTag = async (req,res) => {
  const ptag = req.params.tag
  const tagQuery = ptag || {$exists:true} //store w/specific tag OR any store that has a tag
  // const tags = await Store.getTagsList()
  // const stores = await Store.find(blah,blah,blah) //in serial, NOT in parallel. so...
  const tagsPromise = Store.getTagsList()
  // const storesPromise = Store.find({tags: ptag})
  const storesPromise = Store.find({tags: tagQuery})
  const [tags,stores] = await Promise.all([tagsPromise,storesPromise])
  // res.json(result)
  console.log('controller tags:', tags)
  console.log('controller stores (len):', stores.length)
  res.render('tagView', {tags, stores, title:'Tags', ptag})
}






// exports.myMiddleware = (req,res,next) => {
//   req.foofy = 'barbie'
//   // throw new Error('Error intentionally thrown...')
//   next()
// }