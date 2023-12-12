require('dotenv').config();

const knex = require('../database/knex');
const Payment = require('../models/Payment');
const Message = require('../utils/Message');

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

function roundToZero(num) {
    return +(Math.round(num + "e+0") + "e-0");
}

class Order {

    static async countOrders() {
        try {
            const result = await knex('tb_order').count('id', { as: 'quantity' }).where({ 'is_deleted': false, 'current_status': 'paid' });

            return { success: true, numProducts: result[0].quantity };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar a contagem de compras!' }
        }
    }

    static async findOne(id) {
        try {
            const order = await knex.select('*')
                .from('tb_order')
                .innerJoin('tb_address', 'tb_address.id', 'tb_order.id_address')
                .where({ 'tb_order.id': id });
            if (order[0]) {
                order[0].id = id;
                return { success: true, order: order[0] }
            } else return { success: false, message: 'Não foi possível recuperar os dados da compra / Compra inexistente' };
        } catch (error) {
            Message.warning(error);
            return { success: false, messagem: 'Houve um erro ao recuperar os dados da compra!' };
        }
    }
    static async findByPaymentId(id) {
        try {
            const order = await knex.select('*')
                .from('tb_order')
                .where({ 'tb_order.payment_id': id });
            if (order[0]) {
                return { success: true, order: order[0] }
            } else return { success: false, message: 'Não foi possível recuperar os dados da compra / Compra inexistente' };
        } catch (error) {
            Message.warning(error);
            return { success: false, messagem: 'Houve um erro ao recuperar os dados da compra!' };
        }
    }

    static async findAllByClientId(id_client, page) {
        try {
            const order = await knex.select('*')
                .from('tb_order')
                .where({ id_client })
                .orderBy('created_at', 'DESC')
                .paginate({
                    perPage: 20,
                    currentPage: page,
                    isLengthAware: true
                });

            return order.data[0] ? { success: true, order } : { success: false, message: 'Não foi possível recuperar os dados da compra / Compra inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar a compra!' };
        }
    }

    static async findAllBySalesmanId(id_salesman, page, method) {

        try {
            const order = await knex.select('tb_order.id', 'tb_order.order_total', 'tb_order.method', 'tb_order.id_address', 'tb_order.portions', 'tb_order.id_client', 'tb_order.current_status', 'tb_order.created_at')
                .from('tb_order')
                .join('tb_order_product', { 'tb_order.id': 'tb_order_product.id_order' })
                .join('tb_product', { 'tb_order_product.id_product': 'tb_product.id' })
                .where({ 'tb_product.id_salesman': id_salesman, 'current_status': 'paid', 'tb_order_product.status': method })
                .orderBy('tb_order.created_at', 'DESC')
                .groupBy('tb_order.id')
                .paginate({
                    perPage: 20,
                    currentPage: page,
                    isLengthAware: true
                });
            console.log(order)
            return order.data[0] ? { success: true, order } : { success: false, message: 'Não foi possível recuperar os dados da compra / Compra inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar a compra!' };
        }
    }

    static async findAll(page, method) {

        try {
            const order = await knex.select('tb_order.id', 'tb_order.order_total', 'tb_order.method', 'tb_order.id_address', 'tb_order.portions', 'tb_order.id_client', 'tb_order.current_status', 'tb_order.created_at')
                .from('tb_order')
                .join('tb_order_product', { 'tb_order.id': 'tb_order_product.id_order' })
                .join('tb_product', { 'tb_order_product.id_product': 'tb_product.id' })
                .where({ 'current_status': 'paid', 'tb_order_product.status': method })
                .orderBy('tb_order.created_at', 'DESC')
                .groupBy('tb_order.id')
                .paginate({
                    perPage: 20,
                    currentPage: page,
                    isLengthAware: true
                });

            return order.data[0] ? { success: true, order } : { success: false, message: 'Não foi possível recuperar os dados das compras / Compras inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar as compras!' };
        }
    }

    static async getStatusOrderProduct() {
        try {
            const order = await knex.raw("select status, count(status) from tb_order join tb_order_product on tb_order.id = tb_order_product.id_order" +
                " where tb_order.current_status = 'paid' group by status");

            return order.rows[0] ? { success: true, status: order.rows } : { success: false, message: 'Não foi possível recuperar a situação dos pedidos / Pedidos inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao obter a situação dos pedidos!' };
        }
    }

    // Relação mensal de compras
    static async getOrdersAtMonth() {
        try {
            const order = await knex.raw("SELECT date_part('month', created_at) AS month, count(created_at) AS orders, " +
                "SUM(order_total) AS total FROM tb_order GROUP BY month, DATE_TRUNC('year',created_at) ORDER BY month DESC LIMIT 12 ");

            return order.rows[0] ? { success: true, order: order.rows } : { success: false, message: 'Não foi possível recuperar a relação mensal / Vendas inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao obter a relação mensal de novas vendas!' };
        }
    }

    static async getOrdersAtMonthSalesman(id_salesman) {
        try {
            const order = await knex.raw("SELECT date_part('month', tb_order_product.created_at) AS month, count(tb_order_product.created_at) AS orders " +
                "FROM tb_order_product INNER JOIN tb_product ON tb_product.id = tb_order_product.id_product WHERE id_salesman = " + id_salesman + " GROUP BY month, DATE_TRUNC('year',tb_order_product.created_at) ORDER BY month DESC LIMIT 12 ");
            return order.rows[0] ? { success: true, order: order.rows } : { success: false, message: 'Não foi possível recuperar a relação mensal / Vendas inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao obter a relação mensal de novas vendas!' };
        }
    }

    // Relação mensal de compras por Vendedor
    static async getOrderPerMonthBySalesman(id_salesman) {
        try {
            const order = await knex.raw("SELECT date_part('month', tb_order_product.created_at) AS month, COUNT(tb_order_product.created_at) AS orders, SUM(tb_order_product.price)" +
                " FROM tb_order_product JOIN tb_product on tb_order_product.id_product = tb_product.id WHERE tb_product.id_salesman = " + id_salesman +
                " GROUP BY month, DATE_TRUNC('year',tb_order_product.created_at) ORDER BY month DESC LIMIT 12;");

            return order.rows[0] ? { success: true, order: order.rows } : { success: false, message: 'Não foi possível recuperar a relação mensal / Vendas inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao obter a relação mensal de novas vendas!' };
        }
    }

    // Relação anual de compras
    static async getOrdersAtYear() {
        try {
            const order = await knex.raw("SELECT date_part('year', created_at) AS year, COUNT(created_at) AS orders, " +
                "SUM(order_total) AS total FROM tb_order GROUP BY year ORDER BY year DESC LIMIT 10 ");

            return order.rows[0] ? { success: true, order: order.rows } : { success: false, message: 'Não foi possível recuperar a relação anual / Vendas inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao obter a relação anual de novas vendas!' };
        }
    }

    static async getSalesmanOrdersAtYear(id_salesman) {
        try {
            const order = await knex.raw("SELECT date_part('year', tb_order_product.created_at) AS year, COUNT(tb_order_product.created_at) AS orders " +
                " FROM tb_order_product INNER JOIN tb_product ON tb_product.id = tb_order_product.id_product WHERE id_salesman = " + id_salesman + " GROUP BY year ORDER BY year DESC LIMIT 10 ");
            return order.rows[0] ? { success: true, order: order.rows } : { success: false, message: 'Não foi possível recuperar a relação anual / Vendas inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao obter a relação anual de novas vendas!' };
        }
    }

    static async create(data, client, address) {
        try {
            return await knex.transaction(async trx => {
                let order_total = 0;
                let tax_total = 0;

                let products = [];
                let sales = [];

                for (const pBought of data.products) {

                    const p = await knex('tb_product')
                        .transacting(trx)
                        .forUpdate()
                        .select('quantity')
                        .where({ id: pBought.id_product });



                    let prod = await knex('tb_product')
                        .select('tb_product.id', 'tb_product.title', 'tb_product.price', 'tb_product.price_total', 'tb_product.id_salesman', 'tb_product.width', 'tb_product.height', 'tb_product_discount.value', 'tb_product_discount.is_deleted')
                        .leftJoin('tb_product_discount', 'tb_product_discount.id', 'tb_product.id_discount')
                        .where({ 'tb_product.id': pBought.id_product, 'tb_product.is_active': true, 'tb_product.is_deleted': false });

                    prod = prod[0];


                    if (!prod) throw new Error('Produto inexistente!');

                    let salesman = await trx('tb_salesman')
                        .select('*')
                        .where({ 'id': prod.id_salesman, 'is_deleted': false });

                    salesman = salesman[0];

                    if (!salesman) throw new Error('Vendedor inexistente!');

                    if (salesman.id !== prod.id_salesman)
                        throw new Error('Vendedor inconsistente!');

                    if (!prod || !salesman)
                        throw new Error('Não foi possível recuperar as informações!');

                    if (p[0].quantity <= 0)
                        throw new Error(`Quantidade informada de ${prod.title} menor que 1!`);

                    if (p[0].quantity < pBought.quantity)
                        throw new Error(`Quantidade de ${prod.title} maior que a disponível!`);

                    if (prod.price !== pBought.price)
                        throw new Error(`Preço de produtos inválido, atualize a página!`);

                    let aux;
                    if (prod.value && !prod.is_deleted) {
                        aux = (prod.price - prod.value) * prod.width * prod.height;
                        order_total += roundToTwo(aux * pBought.quantity);
                    } else {
                        aux = prod.price_total;
                        order_total += roundToTwo(aux * pBought.quantity);
                    }

                    sales.push({
                        id_salesman: salesman.id,
                        id_product: prod.id,
                        product_title: prod.title,
                        quantity: p[0].quantity,
                        unit_price: parseInt(aux.toFixed(0)),
                        price: pBought.quantity * aux,
                    });

                    products.push({ id_product: prod.id, width: prod.width, height: prod.height, price: prod.price, price_total: aux, discount: prod.value, quantity: pBought.quantity, available_quantity: p[0].quantity, tax: process.env.PERCENTAGE_TAX });
                }

                const tax = Payment.getTax();

                tax_total = parseFloat(tax.process.value);

                if (data.method == 'B')
                    tax_total += tax.boleto.value;
                else if (data.method == 'C')
                    tax_total = (parseFloat(order_total) + parseFloat(tax_total)) * parseFloat(tax.credit_card[parseInt(data.portions) - 1].value) + parseFloat(tax.process.value);
                else if (data.method == 'P')
                    tax_total = (order_total + tax_total) * tax.pix.value + parseFloat(tax.process.value);
                
                if (Math.abs(parseFloat(data.tax_total) - parseFloat(tax_total)) > 0.04)
                    throw new Error(`Taxas inválidas, atualize a página!`);

                let order = await trx('tb_order').insert({ order_total, id_client: client.client.id_client, id_address: address.address.id, portions: data.portions, method: data.method, tax_total: tax_total }).returning('*');
                order = order[0];

                for (const prod of products) {
                    if (prod.available_quantity - prod.quantity)
                        await trx('tb_product').update('quantity', prod.available_quantity - prod.quantity)
                            .where({ 'id': prod.id_product });
                    else
                        await trx('tb_product').update({ 'quantity': 0, 'is_active': false })
                            .where({ 'id': prod.id_product });

                    delete prod['available_quantity'];

                    prod.id_order = order.id;
                }

                await trx('tb_order_product').insert(products);

                const paymentResponse = await Payment.execute(sales, { portions: data.portions, method: data.method, card_hash: data.card_hash, document: data.document, name: data.name, total: parseInt(((parseFloat(order_total) + parseFloat(tax_total)) * 100)).toFixed(0), tax_total: parseInt(tax_total * 100).toFixed(0) }, client, address, order.id);
                if (!paymentResponse.success) throw new Error(paymentResponse.message);

                const paymentData = paymentResponse.payment;

                if (paymentData.status == 'failed' || paymentData.status == 'with_error')
                    throw new Error("Ocorreu uma falha ao realizar o pagamento!");

                let dataResponse = {};
                if (data.method == 'P') {
                    dataResponse = {
                        qr: paymentData.charges[0].last_transaction.qr_code,
                        qr_url: paymentData.charges[0].last_transaction.qr_code_url,
                        expires_at: paymentData.charges[0].last_transaction.expires_at,
                    };
                }
                else if (data.method == 'B') {
                    dataResponse = {
                        url: paymentData.charges[0].last_transaction.url,
                        pdf: paymentData.charges[0].last_transaction.pdf,
                        line: paymentData.charges[0].last_transaction.line,
                        barcode: paymentData.charges[0].last_transaction.barcode,
                        qr_code: paymentData.charges[0].last_transaction.qr_code,
                    };
                }

                let orderPaymentInfo = {
                    id: paymentData.id,
                    status: paymentData.status,
                    data: dataResponse
                };

                await trx('tb_order')
                    .update({ payment_json: JSON.stringify(paymentData), payment_id: paymentData.id })
                    .where({ 'id': order.id });

                return { success: true, order, orderPaymentInfo };
            });
        } catch (error) {
            Message.warning(error);
            return { success: false, message: error.message }
        }
    }

    static async update(data) {
        try {
            const id = data.id;
            delete data['id'];

            if (data.current_status === 'refused') {
                await knex.transaction(async trx => {
                    await trx.update(data)
                        .table('tb_order')
                        .where({ id });

                    const orderProducts = await trx('tb_order_product')
                        .select('id_product', 'quantity')
                        .where({ 'id_order': id });

                    for (const pBought of orderProducts) {
                        await trx('tb_product')
                            .update({
                                'quantity': trx.raw('?? + ' + pBought.quantity, ['quantity'])
                            }).where({ 'id': pBought.id_product });
                    }
                });
            } else {
                await knex.update(data)
                    .table('tb_order')
                    .where({ id });
            }

            return { success: true, message: 'Situação da compra atualizada!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Situação da compra não atualizada!' };
        }
    }

    static async findAllOpenBoletoOrders() {
        try {
            const result = await knex.raw("SELECT * FROM tb_order where updated_at <= (NOW() - INTERVAL '5 DAY') and current_status = 'waiting_payment' and method = 'B';");
            return result.rows[0] ? { success: true, orders: result.rows } : { success: false, message: 'Houve um erro ao recuperar as ordens!' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async refuseOrder(id, current_status, refuse_reason) {
        try {
            await knex.update({ current_status, refuse_reason })
                .table('tb_order')
                .where({ id })

            return { success: true }
        } catch (error) {
            Message.warning(error, 'refuse');
            return { success: false, message: 'Houve um erro ao atualizar a compra!' };
        }
    }
}

module.exports = Order;
