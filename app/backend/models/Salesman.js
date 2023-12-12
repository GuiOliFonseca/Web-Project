const knex = require("../database/knex");
const Message = require('../utils/Message');

class Salesman {
    static async findOne(id, ignore = false) {
        try {
            let salesman;

            if (ignore) {
                salesman = await knex.select('id as id_salesman', 'id_user', 'is_deleted')
                    .from('tb_salesman')
                    .where({ id });

            } else {
                salesman = await knex.select('tb_salesman.id as id_salesman', 'tb_user.id as id_user', 'business_name', 'cnpj', 'tb_salesman.is_deleted', 'tb_salesman.id_address', 'tb_salesman.created_at', 'tb_salesman.updated_at', 'name', 'surname', 'email', 'tel', 'type', 'birthdate', 'is_verified')
                    .from('tb_salesman')
                    .where({ 'tb_salesman.id': id, 'tb_salesman.is_deleted': false })
                    .innerJoin('tb_user', 'tb_salesman.id_user', '=', 'tb_user.id');

            }

            return salesman[0] ? { success: true, salesman: salesman[0] } : { success: false, messaage: 'Não foi possível recuperar o vendedor / Vendedor inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar o vendedor!' };
        }
    }

    static async findAll(page) {
        try {
            const salesman = await knex.select('tb_salesman.id as id_salesman', 'tb_user.id as id_user', 'business_name', 'cnpj', 'tb_salesman.is_deleted', 'tb_salesman.created_at', 'tb_salesman.updated_at', 'name', 'surname', 'email', 'tel', 'type', 'birthdate', 'is_verified')
                .from('tb_salesman')
                .innerJoin('tb_user', 'tb_salesman.id_user', '=', 'tb_user.id')
                .where({ 'tb_salesman.is_deleted': false })
                .orderBy(['tb_user.name', 'tb_user.surname'])
                .paginate({
                    perPage: 20,
                    currentPage: page
                });

            return salesman.data[0] ? { success: true, salesman } : { success: false, message: 'Não foi possível recuperar os vendedores / Vendedores inexistentes!' };;
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar os vendedores!' };
        }
    }

    static async findByEmail(email) {
        try {
            const salesman = await knex.select('tb_salesman.id as id_salesman', 'tb_user.id as id_user', 'business_name', 'cnpj', 'tb_salesman.is_deleted', 'tb_salesman.created_at', 'tb_salesman.updated_at', 'name', 'surname', 'email', 'tel', 'type', 'birthdate', 'is_verified')
                .from('tb_salesman')
                .innerJoin('tb_user', 'tb_salesman.id_user', '=', 'tb_user.id')
                .where({ 'tb_user.email': email });

            return salesman[0] ? { success: true, salesman: salesman[0] } : { success: false, messaage: 'Não foi possível recuperar o vendedor / Vendedor inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar o vendedor!' };
        }
    }

    static async findByTel(tel) {
        try {
            const salesman = await knex.select('tb_salesman.id as id_salesman', 'tb_user.id as id_user', 'business_name', 'cnpj', 'tb_salesman.is_deleted', 'tb_salesman.created_at', 'tb_salesman.updated_at', 'name', 'surname', 'email', 'tel', 'type', 'birthdate', 'is_verified')
                .from('tb_salesman')
                .innerJoin('tb_user', 'tb_salesman.id_user', '=', 'tb_user.id')
                .where({ 'tb_user.tel': tel });

            return salesman[0] ? { success: true, salesman: salesman[0] } : { success: false, messaage: 'Não foi possível recuperar o vendedor / Vendedor inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar o vendedor!' };
        }
    }

    static async findByCnpj(cnpj) {
        try {
            const salesman = await knex.select('tb_salesman.id as id_salesman', 'tb_user.id as id_user', 'business_name', 'cnpj', 'tb_salesman.is_deleted', 'tb_salesman.created_at', 'tb_salesman.updated_at', 'name', 'surname', 'email', 'tel', 'type', 'birthdate', 'is_verified')
                .from('tb_salesman')
                .where({ cnpj })
                .innerJoin('tb_user', 'tb_salesman.id_user', '=', 'tb_user.id');

            return salesman[0] ? { success: true, salesman: salesman[0] } : { success: false, messaage: 'Não foi possível recuperar o vendedor / Vendedor inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar o vendedor!' };
        }
    }

    static async create(user, salesman) {
        try {
            return await knex.transaction(async trx => {
                const id_user = await trx('tb_user').insert(user, 'id');
                salesman['id_user'] = id_user[0];

                const result = await trx('tb_salesman').insert(salesman, '*');

                return { success: true, salesman: result[0] };
            })
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Falha ao inserir vendedor!' };
        }
    }

    static async update(id_user, id_salesman, user, salesman) {
        try {
            return await knex.transaction(async trx => {
                if (Object.keys(salesman).length) await trx('tb_salesman').update(salesman).where({ id: id_salesman });
                if (Object.keys(user).length) await trx('tb_user').update(user).where({ id: id_user });

                return { success: true };
            })
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Falha ao atualizar vendedor!' };
        }
    }

    static async retrieve(id_user, id_salesman) {
        try {
            return await knex.transaction(async trx => {
                await trx('tb_salesman').update({ is_deleted: false }).where({ id: id_salesman });
                await trx('tb_user').update({ is_deleted: false, is_verified: true }).where({ id: id_user });

                await trx('tb_address').update({ is_deleted: false }).where({ id: id_user });

                return { success: true, message: 'Vendedor recuperado!' };
            });
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Vendedor não recuperado!' };
        }
    }

    static async delete(id_user, id_salesman) {
        try {
            /*
            * Não deleta a conta bancária pois o vendedor pode ter valores ainda a serem recebidos
            * Depois de um período ela será desativada automaticamente.
            */

            return await knex.transaction(async trx => {
                await trx('tb_salesman').update({ is_deleted: true }).where({ id: id_salesman });
                await trx('tb_user').update({ is_deleted: true }).where({ id: id_user });

                await trx('tb_address').update({ is_deleted: true }).where({ id: id_user });

                const products = await trx('tb_product')
                    .update({ is_deleted: true, is_active: false })
                    .where({ id_salesman })
                    .returning(['id', 'id_discount', 'key_image']);

                for (const prod of products) {
                    await trx('tb_product_image')
                        .where({ id_product: prod.id })
                        .andWhere('key', '!=', prod.key_image)
                        .del();

                    if (prod.id_discount)
                        await trx('tb_product_discount').update({ is_deleted: true }).where({ id: prod.id_discount });
                }

                return { success: true, message: 'Vendedor deletado!' };
            })
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Vendedor não deletado!' };
        }
    }

    static async findAllSalesmanMessage(id_salesman) {
        try {
            const messages = await knex.select('*')
                .from('tb_salesman_message')
                .where({ id_salesman })
                .orderBy('id', 'DESC')
                .limit(500)

            return messages ? { success: true, messages } : { success: false, message: 'Não foi possível recuperar as mensagens!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar as mensagens!' };
        }
    }

    static async createMessage(data) {
        try {
            await knex('tb_salesman_message').insert(data);
            return { success: true }
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao inserir mensagem!' };
        }
    }
};

module.exports = Salesman;
