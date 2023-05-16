// const paypal= require('../../config/paypal/paypal')
const paypal = require("paypal-rest-sdk");
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AZwRZot0nucoSkPjZKW4slYS8PZ3afUvyOfvKTKCtx8x7-OxqBd5LkUuXycdC6ZlirNstetzhyG5spmj",
  client_secret:
    "EDVjUKJfSiYNHQEqNzs6gJHNCZdxLSabJJRKxa-svCR4vZZ-3WjfNZ1Q6qcfH6AJfbhgoNk5jSefySg-",
});

const payPalController = {
  thanhToanPay: async (req, res) => {
    const info = req.body
    console.log(info)
    const total =  parseFloat(info.price)
    console.log(total)
    const create_payment_json ={
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `http://localhost:3000/default/payment-succes?user=${info.user}&time=${info.time}&number=${
              info.number.map( (item,index)=>{if(index !== info.number.length -1)return `${item},`
              else if(index === info.number.length -1)
                return `${item}`
                } )}&price=${info.price}&combo=${info.combo.map((item,index)=>{if(index !== info.combo.length -1)
                return `${item.id},${item.value}-`
                else if(index === info.combo.length -1)
                return `${item.id},${item.value}`})}`,
              "cancel_url": "http://localhost:8080/api/paypal/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": info.user,
                    "price": total.toString(),
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": total.toString()
            },
            "description": "This is the payment description."
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        console.error("err: ", error);
        res.redirect("http://localhost:8080/api/paypal/cancel");
      } else {
        let links = []
        for (let i = 0; i < payment.links.length; i++) {
        //   console.log(payment.links);
          if (payment.links[i].rel === "approval_url") {
            console.log(payment.links[i].href);
            // res.redirect(`${payment.links[i].href}`);
            links.push(payment.links[i].href)
          }
          
        
       }

     return  res.status(200).json({links})
      }
    });
  },

  PayPalError: async (req, res) => {
    console.log("cancel");
    
  },

  PayPalSuccess: async (req, res) => {
    const payerId = req.body.PayerID;
    const paymentId = req.body.paymentId;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: "1.00",
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          res.render("cancle");
        } else {
          console.log(JSON.stringify(payment));
          // res.redirect("http://localhost:3000");
        }
      }
    );
  },
};

module.exports = payPalController;
