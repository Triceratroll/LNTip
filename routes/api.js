// routes/api.js

const express = require('express');
const router = express.Router();
const { createInvoice, getInvoice, getChannelBalance } = require('lightning');
const lnd = require('../ln/connect'); 

// creates a lightning invoice
router.post('/invoice', async (req, res) => {
  if (!req.body.amount || isNaN(req.body.amount)) {
    return res.status(200).json({
      success: false,
      error: "The invoice amount is mandatory"
    });
  }
  try {
    const prefix = process.env.INVOICE_PREFIX || '';
    const description = prefix + req.body.description;
    const invoice = await createInvoice({
      lnd, 
      description,
      tokens: req.body.amount
    });
    return res.status(200).json({
      hash: invoice.id,
      request: invoice.request,
      success: true,
    }); 
  } catch(error) {
    console.log(error)
    return res.status(200).json({success: false})
  }
})

// lookup invoice status by hash
router.get('/invoice/:hash', async (req, res) => {
  const { hash } = req.params;
  if (!hash) {
    return res.status(200).json({
      success: false,
      error: "The invoice hash is mandatory"
    });
  }
  try {
    const invoice = await getInvoice({
      lnd,
      id: hash,
    });
    if (invoice.is_confirmed) {
      return res.status(200).json({
        paid: invoice.is_confirmed,
        preimage: invoice.secret,
        description: invoice.description,
        success: true,
      });
    } else {
      return res.status(200).json({ success: false });
    }
  } catch (e) {
    return res.status(200).json({ success: false });
  }
});

// get channel balance
router.get('/balance', async (req, res) => {
  try {
    const channels = await getChannelBalance({ lnd });
    return res.status(200).json({
      success: true,
      balance: channels.channel_balance,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ success: false });
  }
});

module.exports = router; 