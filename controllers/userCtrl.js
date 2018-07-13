const mongoose = require('mongoose')
// const User = mongoose.model('User'); //get from singleton in start.js. set in models/User.js
//not needed, yet


exports.loginForm = (req,res) => {
  res.render('login', {title:'Login'})
}
exports.registerForm = (req,res) => {
  res.render('register', {title:'Register'})
}

exports.validateRegister = (req,res,next) => {
  req.checkBody('name', 'Please supply a name').notEmpty() //available from express-validator in app.js
  req.sanitizeBody('name')  
  req.checkBody('email', 'Please supply a email').isEmail()
  req.sanitizeBody('email').normalizeEmail({
    remove_dots:false,
    remove_extensions:false,
    gmail_remove_subaddress:false
  })
  req.checkBody('password', 'Please supply a password').notEmpty()
  req.checkBody('password-confirm', 'Please confirm password').notEmpty()
  req.checkBody('password-confirm', 'Passwords must match').equals(req.body.password)
  
  const errors = req.validationErrors()
  if (errors) {
    req.flash('error', errors.map(err => err.msg))
    res.render('register', {title:'Register', body:req.body, flashes:req.flash()})
    return
  }
  next()
}