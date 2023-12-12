const Order = require('../models/Order');
const OrderProduct = require('../models/OrderProduct');
const Client = require('../models/Client');
const Address = require('../models/Address');
const OrderSchema = require('../schemas/OrderSchema');
const Cart = require('../models/Cart');
const WebSockets = require('../utils/WebSockets');

const Salesman = require('../models/Salesman');
const Email = require('../models/Email');

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
        if (method !== 'C'
            && method !== 'E'
            && method !== 'R') method = 'C';

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
        if (method !== 'C'
            && method !== 'E'
            && method !== 'R') method = 'C';

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

    static async indexOrdersAtMonth(req, res) {
        const id_salesman = req.query.id_salesman;
        if (req.locals.type == 'V' && !id_salesman)
            return res.status(401).send({ success: false, message: 'Você não tem autorização!' });
        let result;

        if (id_salesman) {
            if (isNaN(parseInt(id_salesman)))
                return res.status(400).send({ success: false, message: 'Id de vendedor inválido!' });
            if (id_salesman != req.locals.id_salesman)
                return res.status(401).send({ success: false, message: 'Você não tem autorização!' });

            result = await Order.getOrdersAtMonthSalesman(id_salesman);
        } else result = await Order.getOrdersAtMonth();

        if (result.success) {
            console.log(result)
            for (const data of result.order) {
                switch (data.month) {
                    case 1: data.month = 'Janeiro'; break;
                    case 2: data.month = 'Fevereiro'; break;
                    case 3: data.month = 'Março'; break;
                    case 4: data.month = 'Abril'; break;
                    case 5: data.month = 'Maio'; break;
                    case 6: data.month = 'Junho'; break;
                    case 7: data.month = 'Julho'; break;
                    case 8: data.month = 'Agosto'; break;
                    case 9: data.month = 'Setembro'; break;
                    case 10: data.month = 'Outubro'; break;
                    case 11: data.month = 'Novembro'; break;
                    case 12: data.month = 'Dezembro'; break;
                }
            }
            return res.send(result);
        }
        return res.status(400).send(result);
    }

    static async indexOrdersAtYear(req, res) {
        const id_salesman = req.query.id_salesman;
        if (req.locals.type == 'V' && !id_salesman)
            return res.status(401).send({ success: false, message: 'Você não tem autorização!' });
        let result;

        if (id_salesman) {
            if (isNaN(parseInt(id_salesman)))
                return res.status(400).send({ success: false, message: 'Id de vendedor inválido!' });
            if (id_salesman != req.locals.id_salesman)
                return res.status(401).send({ success: false, message: 'Você não tem autorização!' });
            result = await Order.getSalesmanOrdersAtYear(id_salesman);
        } else result = await Order.getOrdersAtYear();
        return result.success ? res.send(result) : res.status(400).send(result);
    }

    static async indexOrdersSalesmanPerMonth(req, res) {
        const id = req.params.id;

        if (isNaN(parseInt(id)))
            return res.status(404).send({ success: false, message: 'Id de vendedor inválido!' });

        const result = await Order.getOrderPerMonthBySalesman(id);
        if (result.success) {
            for (const data of result.user) {
                switch (data.month) {
                    case 1: data.month = 'Janeiro'; break;
                    case 2: data.month = 'Fevereiro'; break;
                    case 3: data.month = 'Março'; break;
                    case 4: data.month = 'Abril'; break;
                    case 5: data.month = 'Maio'; break;
                    case 6: data.month = 'Junho'; break;
                    case 7: data.month = 'Julho'; break;
                    case 8: data.month = 'Agosto'; break;
                    case 9: data.month = 'Setembro'; break;
                    case 10: data.month = 'Outubro'; break;
                    case 11: data.month = 'Novembro'; break;
                    case 12: data.month = 'Dezembro'; break;
                }
            }
            return res.send(result);
        }
        return res.status(400).send(result);
    }

    static async create(req, res) {

        const schema = OrderSchema.createValidate();
        const { error } = schema.validate(req.body);

        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });


        const { products, id_address, id_user, id_client, method, tax_total} = req.body

        /* if (method === 'B' && portions)
            return res.status(400).send({ success: false, message: 'Não parcela por boleto!' }); */

        const document = req.body.document.replace(/[.\/-]/g, '');

        if (!CPF.isValid(document) && !CNPJ.validate(document)) {
            return res.status(400).send({ success: false, message: 'O documento informado é inválido!' });
        }

        let data = {
            products,
            method,
            document,
            tax_total
        };

        if (method === 'C') {
            data.card_hash = req.body.card_hash;
            data.portions = req.body.portions;
        } else {
            data.name = req.body.name;
        }

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

    static async status(req, res) {

        const body = req.body;
        let payment_json = body.data;
        const order_id = payment_json.id;

        let order = await Order.findByPaymentId(order_id);
        order = order.order;

        if (payment_json.status == 'waiting_payment' || payment_json.status == 'pending' || payment_json.status == 'processing')
            payment_json.status = 'waiting_payment';

        let save = {
            id: order.id,
            current_status: payment_json.status,
            payment_json: JSON.stringify(payment_json),
        };

        if (payment_json.status == 'waiting_payment') {
            const client = await Client.findOne(order.id_client);
            if (order.method == 'B') {
                save = {
                    ...save,
                    boleto_url: payment_json.charges[0].last_transaction.pdf,
                    boleto_barcode: payment_json.charges[0].last_transaction.line,
                };

                client.success ? Email.sendBoleto(
                    payment_json.charges[0].last_transaction.line,
                    payment_json.charges[0].last_transaction.pdf,
                    order.id,
                    client.client.email,
                    client.client.name) : undefined;
            }
            else if (order.method == 'P') {
                client.success ? Email.sendPix(
                    payment_json.charges[0].last_transaction.qr_code,
                    payment_json.charges[0].last_transaction.qr_code_url,
                    order.id, client.client.email,
                    client.client.name) : undefined;
            }
        }
        else if (payment_json.status == 'paid') {
            const orderProducts = await OrderProduct.findAllSalesmanInOrder(order.id);
            if (orderProducts.success) {
                for (const prod of orderProducts.order_products) {
                    let salesmanSocketId = WebSockets.getUserById(prod.id_user);
                    let message = {
                        message: prod.title,
                        type: 'V',
                        aditional: `{ "id_order": ${order.id} }`,
                        id_salesman: prod.id_salesman
                    }
                    Salesman.createMessage(message);
                    Email.sendSalesNotification(prod, order.id, prod.email);
                    if (salesmanSocketId && salesmanSocketId[0] && salesmanSocketId[0].userId) {
                        global.io.of("/").to(salesmanSocketId[0].socketId).emit('salesmanNotification', message);
                    }
                }
            }
        }
        const result = await Order.update(save);
        if (result.success) {
            return res.send(result);
        } else return res.status(400).send(result);
    }

    static async confirmShippingItem(req, res) {
        const id_salesman = req.params.id_salesman;
        const id_order_product = req.params.id_order_product;

        if (isNaN(parseInt(id_salesman)))
            return res.status(400).send({ success: false, message: 'Id de vendedor inválido!' });

        if (isNaN(parseInt(id_order_product)))
            return res.status(400).send({ success: false, message: 'Id de item da compra inválido!' });

        const existOrderProduct = await OrderProduct.findOne(id_order_product);
        if (!existOrderProduct.success)
            return res.status(404).send(existOrderProduct);
        console.log(existOrderProduct, id_salesman)
        if (existOrderProduct.order_product.id_salesman != id_salesman)
            return res.status(401).send({ success: false, message: 'Acesso não autorizado!' });

        if (existOrderProduct.order_product.status !== 'C')
            return res.status(409).send({ success: false, message: 'O item da compra já foi alterado!' })

        const result = await OrderProduct.update({ id: id_order_product, status: 'E' });
        return result.success ? res.send(result) : res.status(400).send(result);
    }

    static async confirmDeliveryItem(req, res) {
        const id_client = req.params.id_client;
        const id_order_product = req.params.id_order_product;
        const id_order = req.params.id_order;

        if (isNaN(parseInt(id_client)))
            return res.status(400).send({ success: false, message: 'Id de cliente inválido!' });

        if (isNaN(parseInt(id_order_product)))
            return res.status(400).send({ success: false, message: 'Id de item da compra inválido!' });

        const existOrderProduct = await OrderProduct.findOne(id_order_product);
        if (!existOrderProduct.success)
            return res.status(404).send(existOrderProduct);

        if (existOrderProduct.order_product.id_order != id_order)
            return res.status(404).send({ success: false, message: 'ID de ordem inválido!' });

        const existOrder = await Order.findOne(id_order);
        if (!existOrder.success)
            return res.status(404).send(existOrder);

        if (existOrder.order.id_client != id_client)
            return res.status(404).send({ success: false, message: 'Acesso negado!' });

        if (existOrderProduct.order_product.status !== 'E')
            return res.status(409).send({ success: false, message: 'É necessário o envio antes de confirmar a entrega!' })

        const result = await OrderProduct.update({ id: id_order_product, status: 'R' });
        return result.success ? res.send(result) : res.status(400).send(result);
    }
}

module.exports = OrderController;
