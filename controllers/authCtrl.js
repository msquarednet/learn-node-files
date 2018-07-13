const passport = require('passport')

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