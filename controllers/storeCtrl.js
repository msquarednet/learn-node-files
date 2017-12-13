exports.homePage = (req,res) => {
  // res.render('hello', {name:'ZAP', dog:'Willy', time:req.query.time, timestamp:Date.now()})
  res.render('index')
}