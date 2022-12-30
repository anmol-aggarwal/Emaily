const keys = require('../config/keys')
const stripe = require('stripe')(keys.stripeSecretKey)
const requireLogin = require('../middlewares/requireLogin')

module.exports = app => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    // instead of this , we use requireLogin middleware
    // if (!req.user) { 
    //   return res.status(401).send({ error: 'You must log in!' })
    // }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500,
      currency: 'usd',
      description: '$5 for 5 credits',
      payment_method_types: ['card']
    });

    req.user.credits += 5
    const user = await req.user.save()
    // console.log(user);
    res.send(user)
  })
}