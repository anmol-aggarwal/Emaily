const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const requireCredits = require('../middlewares/requireCredits')
const Mailer = require('../services/Mailer')
const surveyTemplate = require('../services/emailTemplates/surveyTemplate')
const keys = require('../config/keys')
const Survey = mongoose.model('surveys')
// const sendgrid = require('@sendgrid/mail');
// sendgrid.setApiKey(keys.sendGridKey)
// console.log(keys.sendGridKey);
// async function sendEmail() {
//   const messageData = {
//     to: 'anubhavgupta2002@gmail.com',
//     from: 'aggarwalanmol2507@gmail.com',
//     subject: 'Sendgrid test email from Node.js on Google Cloud Platform',
//     text: 'Well hello! This is a Sendgrid test email from Node.js on Google Cloud Platform.',
//     html: "<p>this is a test</p>"
//   }

//   try {
//     await sendgrid.send(messageData)
//     console.log(messageData);
//     console.log("msg sent");
//   } catch (error) {
//     console.log(error);
//   }
// }

// sendEmail()

module.exports = app => {
  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email })),
      _user: req.user.id,
      dateSent: Date.now()
    });
    // console.log(survey)
    // console.log(survey.recipients);
    // const x = survey.recipients.split(',').map(email => ({ email: email.trim() }))
    // console.log(x);
    // Great place to send an email!
    const mailer = new Mailer(survey, surveyTemplate(survey));
    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();
      console.log("Sent");
      res.send(user);
    } catch (err) {
      console.log("Not Sent");
      console.log(err.message);
      res.status(422).send(err);
    }
  })
}