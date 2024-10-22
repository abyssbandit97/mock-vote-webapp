// const createStripeInstance = require('../utils/stripesetup');
// const stripe = createStripeInstance();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');

console.log(process.env.STRIPE_SECRET);



router.post('/vote', async (req, res) => {
  const { candidate } = req.body;
  const ip = req.ip;

  if (!candidate) {
    return res.status(400).json({ message: 'Candidate is required' });
  }

  try {
    const existingFreeVote = await Vote.findOne({ ip, paid: false });

    if (existingFreeVote) {
      // console.log('You have already cast a free vote');
      return res.status(400).json({ message: 'You have already cast a free vote' });
      
    }

    const newVote = new Vote({ candidate, ip });
    await newVote.save();

    res.status(201).json({ message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ message: 'An error occurred while recording your vote. Please try again later.' });
  }
});

router.post('/paid-vote', async (req, res) => {
    const { candidate, paymentMethodId, amount } = req.body;
  
    if (!candidate || !paymentMethodId || !amount) {
      return res.status(400).json({ message: 'Candidate, paymentMethodId, and amount are required' });
    }
  
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe expects amount in cents
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        return_url: 'https://google.com',
        description: `Paid vote for ${candidate}`
      });
  
      if (paymentIntent.status === 'succeeded') {
        const newVote = new Vote({ candidate, ip: req.ip, paid: true });
        await newVote.save();
        res.status(201).json({ message: 'Paid vote recorded successfully' });
      } else {
        res.status(400).json({ message: 'Payment failed' });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      if (error.type === 'StripeCardError') {
        res.status(400).json({ message: 'Your card was declined. Please try a different payment method.' });
      } else {
        res.status(500).json({ message: 'An error occurred while processing your payment. Please try again later.' });
      }
    }
  });
  
router.get('/results', async (req, res) => {
    try {
      const results = await Vote.aggregate([
        { $group: { _id: '$candidate', count: { $sum: 1 } } }
      ]);
  
      const defaultResults = {
        'Plump': 0,
        'Parris': 0
      };
  
      results.forEach(result => {
        defaultResults[result._id] = result.count;
      });
  
      const finalResults = Object.entries(defaultResults).map(([candidate, count]) => ({
        _id: candidate,
        count: count
      }));
  
      res.json(finalResults);
    } catch (error) {
      console.error('Error fetching results:', error);
      res.status(500).json({ message: 'An error occurred while fetching results. Please try again later.' });
    }
  });

  router.post('/api/confirm-payment', async (req, res) => {
    const { payment_intent_id } = req.body;
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(payment_intent_id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Vote = require('../models/Vote');

// router.post('/vote', async (req, res) => {
//   const { candidate } = req.body;
//   const ip = req.ip;

//   if (!candidate) {
//     return res.status(400).json({ message: 'Candidate is required' });
//   }

//   try {
//     const existingVote = await Vote.findOne({ ip });

//     if (existingVote) {
//       return res.status(400).json({ message: 'You have already cast a vote' });
//     }

//     const newVote = new Vote({ candidate, ip });
//     await newVote.save();

//     res.status(201).json({ message: 'Vote recorded successfully' });
//   } catch (error) {
//     console.error('Error recording vote:', error);
//     res.status(500).json({ message: 'An error occurred while recording your vote. Please try again later.' });
//   }
// });

// router.get('/results', async (req, res) => {
//     try {
//       const results = await Vote.aggregate([
//         { $group: { _id: '$candidate', count: { $sum: 1 } } }
//       ]);
  
//       const defaultResults = {
//         'Candidate A': 0,
//         'Candidate B': 0
//       };
  
//       results.forEach(result => {
//         defaultResults[result._id] = result.count;
//       });
  
//       const finalResults = Object.entries(defaultResults).map(([candidate, count]) => ({
//         _id: candidate,
//         count: count
//       }));
  
//       res.json(finalResults);
//     } catch (error) {
//       console.error('Error fetching results:', error);
//       res.status(500).json({ message: 'An error occurred while fetching results. Please try again later.' });
//     }
//   });
  
//   module.exports = router;