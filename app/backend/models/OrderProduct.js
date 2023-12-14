const Message = require('../utils/Message');
const knex = require('../database/knex');
class OrderProduct {

    static async countOrderProduct(id_salesman) {
        try {
            const result = await knex('tb_order_product')
                .join('tb_product', 'tb_product.id', '=', 'tb_order_product.id_product')
                .sum('tb_order_product.quantity as amount')
                .where({ 'tb_product.id_salesman': id_salesman });

            return { success: true, amountProduct: result[0].amount };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar a contagem de produtos vendidos!' }
        }
    }

    static async findOne(id) {
        try {
            const order = await knex.select(
                'tb_order_product.id AS id_order_product',
                'tb_order_product.price',
                'tb_order_product.quantity',
                'tb_order_product.id_product',
                'tb_order_product.id_order',
                'tb_product.url_image',
                'tb_product.id_salesman'
            ).where({ 'tb_order_product.id': id })
                .from('tb_order_product')
                .innerJoin('tb_product', 'tb_product.id', 'tb_order_product.id_product');

            return order[0] ? { success: true, order_product: order[0] } : { success: false, message: 'Não foi possível recuperar os dados da compra / Compra inexistente' };
        } catch (error) {
            Message.warning(error);
            return { success: false, messagem: 'Houve um erro ao recuperar os dados da compra!' };
        }
    }

    static async findAllSalesmanProducts(id_order, id_salesman) {
        try {
            const order = await knex.select(
                'tb_order_product.id AS id_order_product',
                'tb_order_product.price',
                'tb_order_product.quantity',
                'tb_order_product.id_product',
                'tb_order_product.id_order',
                'tb_product.url_image',
                'tb_product.id_salesman'
            )
                .from('tb_order_product')
                .innerJoin('tb_product', 'tb_product.id', 'tb_order_product.id_product')
                .where({ id_order, id_salesman });

            return order[0] ? { success: true, order_products: order } : { success: false, message: 'Não foi possível recuperar os dados da compra / Compra inexistente' };
        } catch (error) {
            Message.warning(error);
            return { success: false, messagem: 'Houve um erro ao recuperar os dados da compra!' };
        }
    }

    static async findAll(id_order) {
        try {
            const order = await knex.select(
                'tb_order_product.id AS id_order_product',
                'tb_order_product.price',
                'tb_order_product.quantity',
                'tb_order_product.id_product',
                'tb_order_product.id_order',
                'tb_product.url_image',
                'tb_product.id_salesman',
                'tb_product.title',
                'tb_salesman.business_name',
                'tb_salesman.id as id_salesman',
                'tb_salesman.id_user as id_user'
            )
                .from('tb_order_product')
                .innerJoin('tb_product', 'tb_product.id', 'tb_order_product.id_product')
                .innerJoin('tb_salesman', 'tb_salesman.id', 'tb_product.id_salesman')
                .where({ 'tb_order_product.id_order': id_order });

            return order[0] ? { success: true, order_products: order } : { success: false, message: 'Não foi possível recuperar os dados da compra / Compra inexistente' };
        } catch (error) {
            Message.warning(error, 'order all');
            return { success: false, messagem: 'Houve um erro ao recuperar os dados da compra!' };
        }
    }

    static async findAllSalesmanInOrder(id_order) {
        try {
            const order = await knex.select(
                'tb_product.id_salesman',
                'tb_product.title',
                'tb_salesman.business_name',
                'tb_salesman.id as id_salesman',
                'tb_salesman.id_user AS id_user',
                'tb_user.email',
                'tb_user.name'
            )
                .from('tb_order_product')
                .innerJoin('tb_product', 'tb_product.id', 'tb_order_product.id_product')
                .innerJoin('tb_salesman', 'tb_salesman.id', 'tb_product.id_salesman')
                .innerJoin('tb_user', 'tb_salesman.id_user', 'tb_user.id')
                .where({ 'tb_order_product.id_order': id_order });
            return order[0] ? { success: true, order_products: order } : { success: false, message: 'Não foi possível recuperar os dados da compra / Compra inexistente' };
        } catch (error) {
            Message.warning(error);
            return { success: false, messagem: 'Houve um erro ao recuperar os dados da compra!' };
        }
    }
};

module.exports = OrderProduct;