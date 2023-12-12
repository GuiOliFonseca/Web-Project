const BankAccount = require('./BankAccount');
const PagarMe = require('../utils/PagarMe');

let apiKey;
if (process.env.PAYMENT_MODE === 'PRODUCTION') apiKey = process.env.PRODUCTION_API;
else apiKey = process.env.SANDBOX_API;

class Payment {
    static async payByCreditCard(cardToken, installments, items, customer, split, address) {
        let payments = [
            {
                payment_method: 'credit_card',
                credit_card: {
                    card_token: `${cardToken}`,
                    installments: parseInt(installments),
                    statement_descriptor: "ISTONES",
                    card: {
                        billing_address: address
                    }
                },
                split: split
            }
        ]

        try {
            const response = await PagarMe.createSplitPayment(items, customer, payments);
            return { success: true, payment: response };
        } catch (error) {
            console.log(error.response)
            console.log(error)
            return { success: false, message: 'Houve um erro ao realizar o pagamento com Cartão!' };
        }
    }

    static async payByPix(items, customer, split) {
        let payments = [
            {
                payment_method: 'Pix',
                pix: {
                    expires_in: '900',
                    additional_information: [{
                        name: 'ISTONES - ROCHAS ORNAMENTAIS',
                        value: '1'
                    }]
                },
                split: split
            }
        ]

        try {
            const response = await PagarMe.createSplitPayment(items, customer, payments);
            return { success: true, payment: response };
        } catch (error) {
            console.log(error.response);
            console.log(error);
            return { success: false, message: 'Houve um erro ao realizar o pagamento com Pix!' };
        }
    }

    static async payByTicket(items, customer, split) {
        let payments = [
            {
                payment_method: 'boleto',
                boleto: {},
                split: split
            }
        ]

        try {
            const response = await PagarMe.createSplitPayment(items, customer, payments);
            return { success: true, payment: response };
        } catch (error) {
            console.log(error.response);
            console.log(error);
            return { success: false, message: 'Houve um erro ao realizar o pagamento com Boleto!' };
        }
    }

    static async execute(sales, payment, client, address, orderId) {
        let items = [];
        let splitAccounts = [];

        let admin_receiver = process.env.PAYMENT_MODE === 'PRODUCTION' ? process.env.PRODUCTION_RECIPIENT : process.env.SANDBOX_RECIPIENT;
        let ids = {
            [admin_receiver]: parseInt(Math.round(payment.total * parseFloat(process.env.PERCENTAGE_TAX)) + parseInt(payment.tax_total)),
        };

        let sum_value_products = 0;
        for (let i = 0; i < sales.length; i++) {
            sales[i].price *= 100;
            sales[i].price = parseInt(sales[i].price);

            const bankAccount = await BankAccount.findBySalesman(sales[i].id_salesman);
            if (!bankAccount.success)
                return { success: false, message: bankAccount.message };

            if (!(bankAccount.bankAccount.id_recipient in ids))
                ids[bankAccount.bankAccount.id_recipient] = 0;

            ids[bankAccount.bankAccount.id_recipient] += parseInt(sales[i].price * (1 - parseFloat(process.env.PERCENTAGE_TAX)));

            sum_value_products += sales[i].price;

            if (i > 0)
                items.push({
                    amount: parseInt(sales[i].price),
                    description: sales[i].product_title,
                    quantity: 1,
                    code: sales[i].id_product
                });
            else
                items.push({
                    amount: parseInt(sales[i].price) + parseInt(payment.tax_total),
                    description: sales[i].product_title,
                    quantity: 1,
                    code: sales[i].id_product,

                });
        };

        let sum_value_split = 0;
        for (let [key, value] of Object.entries(ids)) {
            sum_value_split += parseInt(value);
            if (key != admin_receiver) {
                splitAccounts.push({
                    recipient_id: key,
                    amount: parseInt(value),
                    type: "flat",
                    options: {
                        charge_processing_fee: false,
                        liable: true
                    }
                });
                continue;
            }
            splitAccounts.push(
                {
                    recipient_id: key,
                    amount: parseInt(value),
                    type: "flat",
                    options: {
                        liable: false,
                        charge_remainder_fee: true,
                        charge_processing_fee: true
                    }
                }
            );
        }

        let discrep = Math.abs(sum_value_products - sum_value_split) - payment.tax_total;
        if ((sum_value_products - sum_value_split) > 0) {
            items[0].amount -= discrep;
        }
        else {
            splitAccounts[0].amount -= discrep;
        }


        let address_f = {
            country: "BR",
            state: address.address.state,
            city: address.address.city,
            zip_code: address.address.zipcode,
            line_1: address.address.street + ', nº' + address.address.num,
            line_2: address.address.neigh,
        };

        let customer = {
            address: address_f,
            name: client.client.name + " " + client.client.surname,
            email: client.client.email,
            document: client.client.cnpj,
            document_type: 'CNPJ',
            type: 'company'
        };

        let result;
        if (payment.method === 'P')
            result = this.payByPix(items, customer, splitAccounts);
        else if (payment.method === 'C')
            result = await this.payByCreditCard(payment.card_hash, payment.portions, items, customer, splitAccounts, address_f);
        else if (payment.method === 'B')
            result = this.payByTicket(items, customer, splitAccounts);

        return result;
    }

    static getPublicToken() {
        const token = process.env.PAYMENT_MODE === 'PRODUCTION' ? process.env.PRODUCTION_PUBLIC_KEY : process.env.SANDBOX_PUBLIC_KEY;
        return token;
    }

    static getTax() {
        const taxas = {
            process: {
                type: 'flat',
                value: parseFloat(process.env.PAYMENT_TAX_REAL_PROCESS)
            },
            boleto: {
                type: 'flat',
                value: parseFloat(process.env.PAYMENT_TAX_REAL_BOLETO)
            },
            pix: {
                type: 'percent',
                value: parseFloat(process.env.PAYMENT_TAX_PIX)
            },
            credit_card: [
                {
                    type: 'percent',
                    value: parseFloat(process.env.PAYMENT_TAX_CREDITCARD_1X),
                    parcels: 1
                },
                {
                    type: 'percent',
                    value: parseFloat(process.env.PAYMENT_TAX_CREDITCARD_2X),
                    parcels: 2,
                },
                {
                    type: 'percent',
                    value: parseFloat(process.env.PAYMENT_TAX_CREDITCARD_3X),
                    parcels: 3,
                },
                {
                    type: 'percent',
                    value: parseFloat(process.env.PAYMENT_TAX_CREDITCARD_4X),
                    parcels: 4,
                },
                {
                    type: 'percent',
                    value: parseFloat(process.env.PAYMENT_TAX_CREDITCARD_5X),
                    parcels: 5,
                },
                {
                    type: 'percent',
                    value: parseFloat(process.env.PAYMENT_TAX_CREDITCARD_6X),
                    parcels: 6,
                },
                {
                    type: 'percent',
                    value: parseFloat(process.env.PAYMENT_TAX_CREDITCARD_7X),
                    parcels: 7,
                },
                {
                    type: 'percent',
                    value: parseFloat(process.env.PAYMENT_TAX_CREDITCARD_8X),
                    parcels: 8,
                },
                {
                    type: 'percent',
                    value: parseFloat(process.env.PAYMENT_TAX_CREDITCARD_9X),
                    parcels: 9,
                },
                {
                    type: 'percent',
                    value: parseFloat(process.env.PAYMENT_TAX_CREDITCARD_10X),
                    parcels: 10,
                },
                {
                    type: 'percent',
                    value: parseFloat(process.env.PAYMENT_TAX_CREDITCARD_11X),
                    parcels: 11,
                },
                {
                    type: 'percent',
                    value: parseFloat(process.env.PAYMENT_TAX_CREDITCARD_12X),
                    parcels: 12,
                },
            ]
        };

        return taxas;
    }
}

module.exports = Payment;
