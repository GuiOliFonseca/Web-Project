require('dotenv').config();

const knex = require('../database/knex');
const Message = require('../utils/Message');

function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
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
            const order = await knex.select('tb_order.id', 'tb_order.order_total', 'tb_order.id_address', 'tb_order.id_client', 'tb_order.current_status', 'tb_order.created_at')
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
            const order = await knex.select('tb_order.id', 'tb_order.order_total', 'tb_order.id_address', 'tb_order.id_client', 'tb_order.current_status', 'tb_order.created_at')
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

    static async create(data, client, address) {
        try {
            return await knex.transaction(async trx => {
                let order_total = 0;

                let products = [];
                let sales = [];

                for (const pBought of data.products) {

                    const p = await knex('tb_product')
                        .transacting(trx)
                        .forUpdate()
                        .select('quantity')
                        .where({ id: pBought.id_product });



                    let prod = await knex('tb_product')
                        .select('tb_product.id', 'tb_product.title', 'tb_product.price', 'tb_product.price_total', 'tb_product.id_salesman')
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

                    aux = prod.price_total;
                    order_total += roundToTwo(aux * pBought.quantity);

                    sales.push({
                        id_salesman: salesman.id,
                        id_product: prod.id,
                        product_title: prod.title,
                        quantity: p[0].quantity,
                        unit_price: parseInt(aux.toFixed(0)),
                        price: pBought.quantity * aux,
                    });

                    products.push({ id_product: prod.id, price: prod.price, price_total: aux, quantity: pBought.quantity, available_quantity: p[0].quantity });
                }

                let order = await trx('tb_order').insert({ order_total, id_client: client.client.id_client, id_address: address.address.id }).returning('*');
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

                return { success: true, order, orderPaymentInfo };
            });
        } catch (error) {
            Message.warning(error);
            return { success: false, message: error.message }
        }
    }
}

module.exports = Order;
