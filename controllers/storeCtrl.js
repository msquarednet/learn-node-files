// exports.myMiddleware = (req,res,next) => {
//   req.foofy = 'barbie'
//   // throw new Error('Error intentionally thrown...')
//   next()
// }

exports.homePage = (req,res) => {
  // console.log(req.foofy)
  res.render('index')
}
exports.addStore = (req,res) => {
  res.render('editStore', {title:'Add Store'})
}
exports.createStore = (req,res) => {
  res.json(req.body)
}