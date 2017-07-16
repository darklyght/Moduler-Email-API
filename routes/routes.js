const nodemailer = require('nodemailer')
const smtp_data = require('../../smtp_api.json')

const transporter = nodemailer.createTransport({
  host: smtp_data.host,
  port: smtp_data.port,
  secure: smtp_data.secure,
  auth: {
    user: smtp_data.auth.user,
    pass: smtp_data.auth.pass
  }
})

var appRouter = function(app) {
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
  });
  app.post('/mail', function(req, res) {
    // console.log('Success')
    // return res.sendStatus(200)
    if (!req.query.from || !req.query.to || !req.query.subject || !req.query.text) {
      return res.status(400).send({'status': 'error', 'message': 'Missing field.'});
    }
    var mailOptions = {
      from: req.query.from,
      to: req.query.to,
      subject: req.query.subject,
      html: req.query.text,
      attachments: [
        {
          filename: req.query.attachment_filename
        }
      ]
    }
    if (req.query.attachment_type === 'pdf' || req.query.attachment_type === 'png') {
      mailOptions.attachments[0].path = req.query.attachment_content
    } else if (req.query.attachment_type === 'csv') {
      mailOptions.attachments[0].content = req.query.attachment_content
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log(error)
          return res.status(500).send({'status': 'error', 'message': error});
      }
      return res.status(200).send({'status': 'success', 'message': ('Message %s sent: %s', info.messageId, info.response)});
    })
  });
}
 
module.exports = appRouter;