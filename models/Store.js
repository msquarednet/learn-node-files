const mongoose = require('mongoose')
const slug = require('slugs')
mongoose.Promise = global.Promise;  //callback?, bluebird?...  NO!, ES6 Promise (async/await)

const storeSchema = new mongoose.Schema({
  name: {type:String, trim:true, required: 'Please enter a store name'},
  slug: String,
  desc: {type:String, trim:true},
  tags: [String],
  created: {type:Date, default:Date.now},
  location: {
    type: {type:String, default:'Point'},
    coordinates: [{type:Number, required:'You must supply coordinates'}], //long,lat
    address: {type:String, required:'You must supply an address'},
  },
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', //model
    required: 'Please choose an Author'
  }
})

//autogen slug, on pre-save(!)
storeSchema.pre('save', async function(next) {  //not arrow because need 'this'
  if (!this.isModified('name')) {
    // return next() //normal syntax
    next()  //middleware...
    return; //exit function
  }
  this.slug = slug(this.name)
  //TODO: ensure slugs are unique
  //find other stores that have slug of foo, foo-1, foo-2, etc (now async)
  const re = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
  const storesWithSlug = await this.constructor.find({slug: re})  //Store.find doesn't exist yet
  console.log(storesWithSlug)
  if (storesWithSlug.length) {this.slug = `${this.slug}-${storesWithSlug.length+1}`}
  next()
})

storeSchema.statics.getTagsList = function() {//this
  //$unwind... 1 store with 3 tags becomes 3 stores, each with 1 tag
  return this.aggregate([
    {$unwind: '$tags'},    //tags is a field
    {$group: { _id:'$tags', count:{$sum:1} }},
    {$sort:  { count:-1 }}
  ])
}


module.exports = mongoose.model('Store', storeSchema)