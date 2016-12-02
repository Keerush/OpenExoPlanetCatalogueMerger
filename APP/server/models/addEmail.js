var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter =nodemailer.createTransport({
  //  pool: true,
  //  host: 'smtp-mail.outlook.com',
  //  port: 587,
  //  secure: true, // use SSL
  service: 'hotmail',
  auth: {
       user: 'openexoplanet@outlook.com',
       pass: 'toronto.space'
   }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'openexoplanet@outlook.com', // sender address
    to: "'#{@options.to.name} #{@options.to.surname}' <#{@options.to.email}>", // list of receivers
    subject: 'New Updates to OpenExoplanet', // Subject line
    text: 'Hello world ?', // plaintext body
    html: '<h1>Dear {{firstname}} {{lastname}}, Here are your Updates</h1>' // html body
};

// send mail with defined transport object
module.exports = {
  send: function () {
    transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});  }
}
