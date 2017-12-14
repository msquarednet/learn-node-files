// exports.myMiddleware = (req,res,next) => {
//   req.foofy = 'barbie'
//   // throw new Error('Error intentionally thrown...')
//   next()
// }

exports.homePage = (req,res) => {
  // console.log(req.foofy)
  res.render('index')
}