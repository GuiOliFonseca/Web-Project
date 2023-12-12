const knex = require('../database/knex');
const Message = require('../utils/Message');

class SalesmanAvaliation {

    static async likeRelation(id_salesman = null) {
        try {
            let result;

            console.log(id_salesman)

            if (id_salesman) result = await knex('tb_salesman_avaliation')
                .count('liked', { as: 'count' })
                .select('liked')
                .groupBy('liked')
                .where({ is_deleted: false, id_salesman });
            else result = await knex('tb_salesman_avaliation')
                .count('liked', { as: 'count' }).select('liked')
                .groupBy('liked')
                .where({ is_deleted: false });


            return { success: true, relation: result };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar a relação!' };
        }
    }

    static async findOne(id) {
        try {
            const avaliation = await knex.select('*')
                .from('tb_salesman_avaliation')
                .where({ id, is_deleted: false });

            return avaliation[0] ? { success: true, avaliation: avaliation[0] } : { success: false, messaage: 'Não foi possível recuperar a avaliação / Avaliação inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar a avaliação!' };
        }
    }

    static async countAvaliations(id_salesman) {
        try {
            const countSatisfaction = await knex.select(knex.raw('COUNT(liked), liked as satisfaction')).from('tb_salesman_avaliation').where({ id_salesman, is_deleted: false }).groupBy('liked');
            return countSatisfaction[0] ? { success: true, avaliation: countSatisfaction } : { success: false, messaage: 'Não foi possivel recuperar as avaliações!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar a avaliação!' };
        }
    }

    static async findByOrderProduct(id_order_product) {
        try {
            const avaliation = await knex.select('*')
                .from('tb_salesman_avaliation')
                .where({ id_order_product, is_deleted: false });

            return avaliation[0] ? { success: true, avaliation: avaliation[0] } : { success: false, messaage: 'Não foi possível recuperar a avaliação / Avaliação inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar a avaliação!' };
        }
    }

    static async findAll(id_salesman, page) {
        try {
            const avaliation = await knex.select('*')
                .from('tb_salesman_avaliation')
                .where({ id_salesman, is_deleted: false })
                .orderBy('created_at', 'DESC')
                .paginate({
                    perPage: 20,
                    currentPage: page
                });

            return avaliation.data[0] ? { success: true, avaliation } : { success: false, message: 'Não foi possível recuperar as avaliações / Avaliações inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar as avaliações!' };
        }
    }

    static async create(data) {
        try {
            const avaliation = await knex.insert(data).table('tb_salesman_avaliation').returning('*');

            return avaliation[0] ? { success: true, avaliation: avaliation[0] } : { success: false, message: 'Não foi possível cadastrar a avaliação!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Falha ao inserir avaliação!' }
        }
    }

    static async update(data) {
        try {
            const id = data.id;
            delete data['id'];

            const avaliation = await knex.table('tb_salesman_avaliation')
                .update(data)
                .where({ id }).returning('*');

            return { success: true, avaliation: avaliation[0] };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Falha ao atualizar avaliação!' };
        }
    }

    static async delete(id) {
        try {
            await knex.update({ is_deleted: true })
                .where({ id })
                .table('tb_salesman_avaliation');

            return { success: true, message: 'Avaliação deletada!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Avaliação não deletada!' };
        }
    }
};

module.exports = SalesmanAvaliation;