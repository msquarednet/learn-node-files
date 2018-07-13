const mongoose = require('mongoose')
mongoose.Promise = global.Promise;  //callback?, bluebird?...  NO!, ES6 Promise (async/await)
                                    //really not needed here (its in start.js),but suppress bug in mongoose package (false positives)

const md5 = require('md5')
const validator = require('validator')
const mongodbErrorHandler = require('mongoose-mongodb-errors')
const passportLocalMongoose = require('passport-local-mongoose')


const userSchema = new mongoose.Schema({
  email:{type:String, unique:true, lowercase:true, trim:true, 
    validate: [validator.isEmail, 'Please enter a valid email address'],
    required: 'Please enter an email address'},
  name: {type:String, trim:true, required: 'Please enter a name'}
  //password: taken care of by passport-local-mongoose
  //gravatar: no, use 'generated' (virtual) field, below
})

userSchema.virtual('gravatar').get(function() {  // return 'https://www.dropbox.com/s/r90g69yjzppxxxl/me-300.png?dl=1'
  // to use gravater, use hash of email address
  const hash = md5(this.email)
  return `https://gravatar.com/avatar/${hash}?s=200`
})

userSchema.plugin(passportLocalMongoose, {usernameField:'email'}) //adds all methods, fields needed for auth :)
userSchema.plugin(mongodbErrorHandler) //nicer errors (for users to see) from mongoDB (unique:true)


module.exports = mongoose.model('User', userSchema)