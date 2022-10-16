// connect.js
const lightning = require('lightning');

// nos autenticamos con lnd
const {lnd} = lightning.authenticatedLndGrpc({
    cert: process.env.LND_CERT_BASE64,
    macaroon: process.env.LND_MACAROON_BASE64,
    socket: process.env.LND_GRPC_HOST,
});

module.exports = lnd;