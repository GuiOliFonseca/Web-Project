const knex = require('../database/knex');
const Message = require('../utils/Message');

class Category {
    static async findOne(id) {
        try {
            const category = await knex.select('*')
                .from('tb_category')
                .where({ id, "is_deleted": false });

            return category[0] ? { success: true, category: category[0] } : { success: false, message: 'Não foi possível recuperar a categoria / Categoria inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar a categoria!' };
        }
    }

    static async findAll() {
        try {
            const category = await knex.select('*')
                .from('tb_category')
                .orderBy('name')

            return category[0] ? { success: true, category } : { success: false, message: 'Não foi possível recuperar as categorias / Categorias inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar as categorias!' };
        }
    }

    static async findMostedUsed() {
        try {
            const category = await knex.select('tb_product.id_category', 'tb_category.name')
                .from('tb_product')
                .leftJoin('tb_category', 'tb_product.id_category', 'tb_category.id')
                .count('tb_product.id_category')
                .where({ "tb_product.is_deleted": false, 'is_active': true })
                .groupBy('tb_category.name')
                .groupBy('tb_product.id_category')
                .orderBy('count', 'desc')
                .limit(5)

            return category[0] ? { success: true, category } : { success: false, message: 'Não foi possível recuperar as categorias / Categorias inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar as categorias!' };
        }
    }

    static async findByName(name) {
        try {
            const category = await knex.select('*')
                .from('tb_category')
                .andWhereRaw("unaccent(:categoryName:) ilike unaccent(:name)", {
                    categoryName: 'tb_category.name',
                    name: name
                });

            return category[0] ? { success: true, category: category[0] } : { success: false, message: 'Não foi possível recuperar a categoria / Categoria inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar a categoria!' };
        }
    }
}

module.exports = Category;