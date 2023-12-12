const Payment = require("../models/Payment");

class PaymentController {
    static async index(req, res) {
        res.send(Payment.getTax());
    };

    static async getToken(req, res) {
        res.send(Payment.getPublicToken());
    };
};

module.exports = PaymentController;