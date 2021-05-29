const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AWTZYBESnrsKeXaAGPNcLltFAHGk7tF8P-uMx1j3o-6SpYl8_UunEcXZA9G2-yLnuTaY5wSQB1dWOW9n',
    'client_secret': 'EHCu_fmCy05xJvHpdNUYoHEQmy0v8os0XOiNeYCvXmzktyMpoJM1FyZncV66BeFIoOLtRnrDjzmxWb2Y'
});

function pay(req,res){
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://127.0.0.1:3000/paypal/success/"+req.body.total,
            "cancel_url": "http://127.0.0.1:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": req.body.name,
                    "price": req.body.price,
                    "currency": "USD",
                    "quantity": "1"
                }]
            },
            "amount": {
                "currency": "USD",
                "total": req.body.price,
            },
            "description": req.body.description
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
}

function success(req,res){
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    console.log("total:" + req.params.total);
    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": req.params.total
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            res.send({
                status:200,
                message: "Success"
            });
        }
    });  
}

function cancel(req,res){
    return res.send({
        status:502,
        message:"Operation canceled"
    })
}


//Export de funcoes
module.exports = {
    pay:pay,
    success:success,
    cancel:cancel
}