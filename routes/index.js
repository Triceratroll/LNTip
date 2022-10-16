// routes index.js
var express = require('express');
const lightning = require('lightning');
const lnd = require('../ln/connect')
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Node info */
router.get('/info', async function(req, res, next){
  try { 

    // obtener información del nodo
    const info = await lightning.getWalletInfo({ lnd });

    // mostramos la info en formato json
    res.send(`
      <h1>Node info</h1>
      <pre>${JSON.stringify(info, null, 2)}</pre>
    `);

    next();

  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
