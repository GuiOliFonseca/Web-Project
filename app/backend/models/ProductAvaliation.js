const knex = require('../database/knex');
const Message = require('../utils/Message');

class ProductAvaliation {

    static async likeRelation(id_salesman = null) {
        try {
            let result;

            console.log(id_salesman)

            if (id_salesman) result = await knex('tb_order_product_avaliation')
                .join('tb_product', 'tb_product.id', 'tb_order_product_avaliation.id_product')
                .count('liked', { as: 'count' })
                .select('liked')
                .groupBy('liked')
                .where({ 'tb_order_product_avaliation.is_deleted': false, id_salesman });
            else result = await knex('tb_order_product_avaliation')
                .join('tb_product', 'tb_product.id', 'tb_order_product_avaliation.id_product')
                .count('liked', { as: 'count' })
                .select('liked')
                .groupBy('liked')
                .where({ 'tb_order_product_avaliation.is_deleted': false });

            return { success: true, relation: result };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar a relação!' };
        }
    }

    static async findOne(id) {
        try {
            const avaliation = await knex.select('*')
                .from('tb_order_product_avaliation')
                .where({ id, 'is_deleted': false });

            return avaliation[0] ? { success: true, avaliation: avaliation[0] } : { success: false, message: 'Não foi possível recuperar a avaliação do produto / Avaliação inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Falha ao recuperar avaliaçao de produto!' };
        }
    }

    static async findByOrderAndOrderProduct(id_order, id_order_product) {
        try {
            const avaliation = await knex.select('*')
                .from('tb_order_product_avaliation')
                .where({ id_order, id_order_product, 'is_deleted': false });

            return avaliation[0] ? { success: true, avaliation: avaliation[0] } : { success: false, message: 'Não foi possível recuperar a avaliação do produto / Avaliação inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Falha ao recuperar avaliação de produto!' };
        }
    }

    static async findAllByOrder(id_order, page) {
        try {
            const avaliation = await knex.select('*')
                .from('tb_order_product_avaliation')
                .where({ id_order, 'is_deleted': false })
                .paginate({
                    perPage: 20,
                    currentPage: page,
                    isLengthAware: true
                });

            return avaliation.data[0] ? { success: true, avaliation } : { success: false, message: 'Não foi possível recuperar as avaliações da compra / Avaliações inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Falha ao recuperar avaliações de compras!' };
        }
    }


    static async findAllByClient(id_client, page) {
        try {
            const avaliation = await knex.select(
                'tb_order_product_avaliation.id',
                'tb_order_product_avaliation.liked',
                'tb_order_product_avaliation.comment',
                'tb_order_product_avaliation.id_order',
                'tb_order_product_avaliation.id_order_product',
                'tb_order_product_avaliation.id_product',
                'tb_order_product_avaliation.is_deleted',
                'tb_order_product_avaliation.created_at',
                'tb_order_product_avaliation.updated_at'
            )
                .from('tb_order_product_avaliation')
                .join('tb_order', 'tb_order.id', 'tb_order_product_avaliation.id_order')
                .where({ 'tb_order.id_client': id_client, 'tb_order_product_avaliation.is_deleted': false })
                .paginate({
                    perPage: 20,
                    currentPage: page,
                    isLengthAware: true
                });

            return avaliation.data[0] ? { success: true, avaliation } : { success: false, message: 'Não foi possível recuperar as avaliações da compra / Avaliações inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Falha ao recuperar avaliações de compras!' };
        }
    }

    static async findAllByProduct(id_product, page) {
        try {
            const avaliation = await knex.select('*')
                .from('tb_order_product_avaliation')
                .where({ id_product, 'is_deleted': false })
                .paginate({
                    perPage: 20,
                    currentPage: page,
                    isLengthAware: true
                });

            return avaliation.data[0] ? { success: true, avaliation } : { success: false, message: 'Não foi possível recuperar a avaliação do produto / Avaliação inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Falha ao recuperar avaliaçao de produto!' };
        }
    }

    static async create(data) {
        try {

            const avaliation = await knex.insert(data).table('tb_order_product_avaliation').returning('*');

            return avaliation[0] ? { success: true, avaliation: avaliation[0] } : { success: false, message: 'Não foi possível cadastrar a avaliação!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Falha ao inserir avaliação de produto!' };
        }
    }

    static async delete(id) {
        try {
            await knex('tb_order_product_avaliation')
                .update({ 'is_deleted': true })
                .where({ id });

            const result = await this.findOne(id);

            return result.success ? { success: false, message: 'Avaliação não deletada!' } : { success: true, message: 'Avaliação deletada!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Falha ao deletar a avaliação do produto!' };
        }
    }
};

module.exports = ProductAvaliation;
