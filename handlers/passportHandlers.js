const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User'); //get from singleton in start.js. set in models/User.js

//config passport... put User on each req
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
