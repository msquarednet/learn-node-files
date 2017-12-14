const mongoose = require('mongoose')
const slug = require('slugs')
mongoose.Promise = global.Promise;  //callback?, bluebird?...  NO!, ES6 Promise (async/await)

const storeSchema = new mongoose.Schema({
  name: {type:String, trim:true, required: 'Please enter a store name'},
  slug: String,
  desc: {type:String, trim:true},
  tags: [String]
})

//autogen slug, on pre-save(!)
storeSchema.pre('save', function(next) {  //not arrow because need 'this'
  if (!this.isModified('name')) {
    // return next() //normal syntax
    next()  //middleware...
    return; //exit function
  }
  this.slug = slug(this.name)
  next()
  //TODO: ensure slugs are unique
})


module.exports = mongoose.model('Store', storeSchema)