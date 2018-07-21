const nodemailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const htmlToText = require('html-to-text')
const promisify = require('es6-promisify')


//transport
const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

const generateHTML = (filename, options={}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options)  // console.log(html)
  return juice(html) //use juice to inline css
}

exports.send = (options) => {
  const html = generateHTML(options.filename, options)
  const text = htmlToText.fromString(html)
  const mailOptions = {
    from: 'ZAP <noreply@zap.zap>',
    to: options.user.email,
    subject: options.subject,
    html,
    text
  }
  const sendMail = promisify(transport.sendMail, transport)
  return sendMail(mailOptions)
}












//test
// transport.sendMail({
//   from: 'ZAP <msquarednettest@gmail.com>',
//   to: 'zap@zap.zap',
//   subject: 'Test Subject',
//   html: 'This is a <b>bold</b> test.',
//   text: 'This is a not-so-bold test.'
// })