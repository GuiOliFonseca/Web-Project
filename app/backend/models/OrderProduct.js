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
                'tb_order_product.price_total',
                'tb_order_product.price',
                'tb_order_product.discount',
                'tb_order_product.tax',
                'tb_order_product.quantity',
                'tb_order_product.id_product',
                'tb_order_product.id_order',
                'tb_order_product.status',
                'tb_order_product.width',
                'tb_order_product.height',
                'tb_product.depth',
                'tb_product.style',
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

    static async findAllSalesmanProducts(id_order, id_salesman, method) {
        try {
            const order = await knex.select(
                'tb_order_product.id AS id_order_product',
                'tb_order_product.price_total',
                'tb_order_product.price',
                'tb_order_product.discount',
                'tb_order_product.tax',
                'tb_order_product.quantity',
                'tb_order_product.id_product',
                'tb_order_product.id_order',
                'tb_order_product.status',
                'tb_product.url_image',
                'tb_order_product.width',
                'tb_order_product.height',
                'tb_product.depth',
                'tb_product.style',
                'tb_product.id_salesman'
            )
                .from('tb_order_product')
                .innerJoin('tb_product', 'tb_product.id', 'tb_order_product.id_product')
                .where({ id_order, id_salesman, 'tb_order_product.status': method });

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
                'tb_order_product.price_total',
                'tb_order_product.price',
                'tb_order_product.discount',
                'tb_order_product.tax',
                'tb_order_product.quantity',
                'tb_order_product.id_product',
                'tb_order_product.id_order',
                'tb_order_product.status',
                'tb_product.url_image',
                'tb_product.id_salesman',
                'tb_product.title',
                'tb_order_product.width',
                'tb_order_product.height',
                'tb_product.depth',
                'tb_product.style',
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

    static async findAllByStatus(id_order, method) {
        try {
            const order = await knex.select(
                'tb_order_product.id AS id_order_product',
                'tb_order_product.price_total',
                'tb_order_product.price',
                'tb_order_product.discount',
                'tb_order_product.tax',
                'tb_order_product.quantity',
                'tb_order_product.id_product',
                'tb_order_product.id_order',
                'tb_order_product.status',
                'tb_product.url_image',
                'tb_product.id_salesman',
                'tb_product.title',
                'tb_order_product.width',
                'tb_order_product.height',
                'tb_product.depth',
                'tb_product.style',
                'tb_salesman.business_name',
                'tb_salesman.id as id_salesman',
                'tb_salesman.id_user as id_user'
            )
                .from('tb_order_product')
                .innerJoin('tb_product', 'tb_product.id', 'tb_order_product.id_product')
                .innerJoin('tb_salesman', 'tb_salesman.id', 'tb_product.id_salesman')
                .where({ 'tb_order_product.id_order': id_order, 'tb_order_product.status': method });

            console.log(order)
            return order[0] ? { success: true, order_products: order } : { success: false, message: 'Não foi possível recuperar os dados da compra / Compra inexistente' };
        } catch (error) {
            Message.warning(error);
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

    static async countSaleStatusBySalesman(id_salesman, method = 'C', isDefault = true) {
        // Se for Default verifica se é igual, caso contrário verifica se é diferente
        try {
            const result = await knex('tb_order_product')
            .count('tb_order_product.id', {as: 'quantity'})
            .innerJoin('tb_product', 'tb_order_product.id_product', 'tb_product.id')
            .where(function(){
                if(isDefault) this.where('status', '=', method);
                else this.where('status', '!=', method);
            })
            .andWhere('tb_product.id_salesman', '=', id_salesman);

            console.log(result[0]);

            return { success: true, numSales: result[0].quantity };
        } catch(error) {
            Message.warning(error);
            return {success: false, message: 'Houve um erro ao recuperar os dados das vendas!'}
        }
    }

    static async countSaleStatusByClient(id_client, method = 'C', isDefault = true) {
        // Se for Default verifica se é igual, caso contrário verifica se é diferente
        try {
            const result = await knex('tb_order_product')
            .count('tb_order_product.id', {as: 'quantity'})
            .innerJoin('tb_order', 'tb_order_product.id_order', 'tb_order.id')
            .where(function(){
                if(isDefault) this.where('status', '=', method);
                else this.where('status', '!=', method);
            })
            .andWhere('tb_order.id_client', '=', id_client);

            console.log(result[0]);

            return { success: true, numOrders: result[0].quantity };
        } catch(error) {
            Message.warning(error);
            return {success: false, message: 'Houve um erro ao recuperar os dados das compras!'}
        }
    }

    static async update(data) {
        try {

            const order = await knex('tb_order_product')
                .update({ 'status': data.status })
                .where({ id: data.id })
                .returning('*');

            return order[0] ? { success: true, order_product: order } : { success: false, message: 'Falha ao atualizar o item!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao atualizar ao item!' };
        }
    }
};

module.exports = OrderProduct;