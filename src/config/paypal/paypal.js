const paypal = require('paypal-rest-sdk');


paypal.configure({
    'mode': 'sandbox', //sandbox or live
     'client_id': 'AZwRZot0nucoSkPjZKW4slYS8PZ3afUvyOfvKTKCtx8x7-OxqBd5LkUuXycdC6ZlirNstetzhyG5spmj',
      'client_secret': 'EDVjUKJfSiYNHQEqNzs6gJHNCZdxLSabJJRKxa-svCR4vZZ-3WjfNZ1Q6qcfH6AJfbhgoNk5jSefySg-'
  });
  
module.exports = paypal  