const passport = require('passport')

const crypto = require('crypto')  //comes with node
const mongoose = require('mongoose')
const User = mongoose.model('User'); //get from singleton in start.js. set in models/User.js
const promisify = require('es6-promisify')


//local strategy
exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed login',
  successRedirect: '/',
  successFlash: 'You are now logged in!'
})

exports.logout = (req,res) => {
  req.logout()
  req.flash('success', 'You have successfully logged out.')
  res.redirect('/')
}


exports.isLoggedIn = (req,res,next) => {
  if (req.isAuthenticated()) {
    next(); return;
  } 
  req.flash('error', 'Ooops, you must be logged-in to do that!')
  res.redirect('/login')  
}

exports.forgot = async(req,res) => {
  //1. see if user with that email exists
  const u = await User.findOne({email:req.body.email})
  if (!u) {
    // req.flash('error', 'A password reset has been mailed to you.') //more secure(?)
    req.flash('error', 'No account with that email exists.')
    res.redirect('/login')
  }
  //2. set reset-tokens and exiry-date on their account
  u.resetPasswordToken = crypto.randomBytes(20).toString('hex')
  u.resetPasswordExpiry= Date.now()+3600000 //1 hr from now //note:update schema
  await u.save()
  //3. send email with token
  //cheat, SKIP EMAIL, for now...
  const resetUrl = `http://${req.headers.host}/account/reset/${u.resetPasswordToken}`
  req.flash('success', `You have been emailed a password reset link: ${resetUrl}`)
  //4. redirect to login page
  res.redirect('/login')
}

exports.reset = async(req,res) => {
  //res.json(req.params)
  //1. does someone have this token?
  //2. is token expired?
  const u = await User.findOne({
    resetPasswordToken:req.params.token,
    resetPasswordExpiry: {$gt:Date.now()}
  })
  if (!u) {
    // req.flash('error', 'A password reset has been mailed to you.') //more secure(?)
    req.flash('error', 'Password reset token is invalid or has expired.')
    res.redirect('/login')
  }
  //if there IS a user, show the reset password form
  res.render('reset', {title: 'Reset you password'})
}

exports.passwordConfirm = (req,res,next) => {
  if (req.body.password===req.body.password_confirm) {//dash no worky with dot notation(!)
    next(); return;
  } 
  req.flash('error', 'Passwords do not match!')
  res.redirect('back')  
}

exports.update = async (req,res) => {
  //res.json(req.params)
  //2. is token expired?
  const u = await User.findOne({
    resetPasswordToken:req.params.token,
    resetPasswordExpiry: {$gt:Date.now()}
  })
  if (!u) {
    req.flash('error', 'Password reset token is invalid or has expired.')
    res.redirect('/login')
  }
  //if there IS a unexpired (okay) user, update password
  // u.setPassword()//callback, so promisify, from passport
  const setPassword = promisify(u.setPassword, u)
  await setPassword(req.body.password)
  u.resetPasswordToken = undefined  //remove field
  u.resetPasswordExpiry= undefined  //remove field
  const updatedUser = await u.save()
  await req.login(updatedUser)  //thx passport
  req.flash('success', 'Your password has been reset! You are now logged in :)')
  res.redirect('/')
}
