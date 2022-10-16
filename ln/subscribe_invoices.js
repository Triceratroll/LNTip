
const {subscribeToInvoices} = require('lightning');
const lnd = require('./connect');

/***
TODO: Para un mejor rendimiento lo mejor es utilizar la subscripción de invoices
En lugar de consultar al nodo lnd cada segundo.
Una vez estemos utilizando este sistema con base de datos se deberia usar esto
***/

// cada vez que ocurra un cambio en una invoice se chequea si la invoice ha sido pagada
const subscribeInvoices = async () => {
  try {
    const sub = subscribeToInvoices({lnd});
    sub.on('invoice_updated', async invoice => {
      if (!invoice.is_confirmed) return;

      // Una vez una invoice generada por el nodo haya sido pagada
      // guardamos en base de datos la invoice como pagada
      console.log('Invoice paid!');
    });
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports = subscribeInvoices;