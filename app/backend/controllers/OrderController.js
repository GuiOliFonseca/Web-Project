const Order = require('../models/Order');
const OrderProduct = require('../models/OrderProduct');
const Client = require('../models/Client');
const Address = require('../models/Address');
const OrderSchema = require('../schemas/OrderSchema');
const Cart = require('../models/Cart');

const Salesman = require('../models/Salesman');

const CPF = require('cpf');
const CNPJ = require('cnpj');

class OrderController {

    static async quantitySold(req, res) {
        const result = await Order.countOrders();

        return result.success ? res.send(result) : res.status(400).send(result);
    }

    static async statusOrderProducts(req, res) {
        const result = await Order.getStatusOrderProduct();

        return result.success ? res.send(result) : res.status(400).send(result);
    }

    static async amountProduct(req, res) {
        const id_salesman = req.params.id;

        if (isNaN(parseInt(id_salesman)))
            return res.status(400).send({ success: false, message: 'Id de vendedor inválido!' });

        const result = await OrderProduct.countOrderProduct(id_salesman);

        return result.success ? res.send(result) : res.status(400).send(result);
    }

    static async indexOrderClient(req, res) {
        let page = req.query.page;

        if (isNaN(parseInt(page))) page = '1';

        const id_client = req.params.id;

        if (isNaN(parseInt(id_client)))
            return res.status(400).send({ success: false, message: 'Id de compra inválido' });

        const orders = await Order.findAllByClientId(id_client, page);
        if (orders.success) {
            for (const order of orders.order.data) {
                const prods = await OrderProduct.findAll(order.id);
                order.products = prods.order_products;
            }

            return res.send(orders);
        } else return res.status(404).send(orders);
    }

    static async indexOrderSalesman(req, res) {

        const id_salesman = req.params.id;

        if (isNaN(parseInt(id_salesman)))
            return res.status(400).send({ success: false, message: 'Id de vendedor inválido!' });

        let { page, method } = req.query;

        if (isNaN(parseInt(page))) page = '1';

        const orders = await Order.findAllBySalesmanId(id_salesman, page, method);

        if (orders.success) {
            for (const order of orders.order.data) {
                const prods = await OrderProduct.findAllSalesmanProducts(order.id, id_salesman, method);
                order.products = prods.order_products;
            }
            return res.send(orders);
        } else return res.status(404).send(orders);
    }

    static async index(req, res) {

        let { page, method } = req.query;

        if (isNaN(parseInt(page))) page = '1';

        const orders = await Order.findAll(page, method);

        if (orders.success) {
            for (const order of orders.order.data) {
                const prods = await OrderProduct.findAllByStatus(order.id, method);
                order.products = prods.order_products;
            }
            return res.send(orders);
        } else return res.status(404).send(orders);
    }

    static async show(req, res) {
        const id = req.params.id;

        if (isNaN(parseInt(id)))
            return res.status(404).send({ success: false, message: 'Id de compra inválido!' });

        let order = await Order.findOne(id); //Recupera os dados da ordem
        if (!order.success) return res.status(404).send(order);

        let prods = await OrderProduct.findAll(order.order.id);

        if (!prods.success) return res.status(404).send(prods);
        prods = prods.order_products;

        if (req.locals.type == 'V') {
            order.order.order_total = 0;
            prods = prods.filter(prod => {
                if (prod.id_salesman == req.locals.id_salesman)
                    order.order.order_total += (prod.price_total - (prod.discount * prod.price_total / prod.price)) * prod.quantity;

                return prod.id_salesman == req.locals.id_salesman;
            })
        }

        order.order.products = prods;
        return res.send(order);
    }

    static async create(req, res) {

        const schema = OrderSchema.createValidate();
        const { error } = schema.validate(req.body);

        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });


        const { products, id_address, id_user, id_client} = req.body

        const document = req.body.document.replace(/[.\/-]/g, '');

        if (!CPF.isValid(document) && !CNPJ.validate(document)) {
            return res.status(400).send({ success: false, message: 'O documento informado é inválido!' });
        }

        let data = { products };

        const existClient = await Client.findOne(id_client);
        if (!existClient.success)
            return res.status(404).send(existClient);

        const existAddress = await Address.findOne(id_address);
        if (!existAddress.success)
            return res.status(404).send(existAddress);

        if (existAddress.address.id_user !== id_user)
            return res.status(404).send({ success: false, message: 'O endereço informado não é do usuário!' });

        const result = await Order.create(data, existClient, existAddress);
        if (result.success) await Cart.deleteAll(id_user);

        return result.success ? res.status(201).send(result) : res.status(400).send(result);
    }
}

module.exports = OrderController;
