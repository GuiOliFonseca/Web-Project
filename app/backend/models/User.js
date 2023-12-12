const knex = require("../database/knex");
const Message = require('../utils/Message');

class User {
    static async findByEmail(email) {
        try {
            const user = await knex.select('id', 'name', 'surname', 'email', 'tel', 'type', 'birthdate', 'is_deleted').from('tb_user').where({ email });
            return user[0] ? { success: true, user: user[0] } : { success: false, message: 'Não foi possível recuperar o usuário / Usuário inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar o usuário!' };
        }
    }

    static async findByTel(tel) {
        try {
            const user = await knex.select('id', 'name', 'surname', 'email', 'tel', 'type', 'birthdate', 'is_deleted').from('tb_user').where({ tel });
            return user[0] ? { success: true, user: user[0] } : { success: false, message: 'Não foi possível recuperar o usuário / Usuário inexistente!' };
        } catch (error) {
            return { success: false, message: 'Houve um erro ao recuperar o usuário!' };
        }
    }

    static async findUserWithPassword(email) {
        try {
            const user = await knex.select('*')
                .from('tb_user')
                .where({ email });

            return user[0] ? { success: true, user: user[0] } : { success: false, message: 'Não foi possível recuperar o usuário / Usuário inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar o usuário!' };
        }
    }

    static async findClientByUserId(id_user) {
        try {
            const user = await knex.select('*')
                .from('tb_client')
                .where({ id_user });

            return user[0] ? { success: true, client: user[0] } : { success: false, message: 'Não foi possível recuperar o usuário / Usuário inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar o usuário!' };
        }
    }

    static async findSalesmanByUserId(id_user) {
        try {
            const user = await knex.select('*')
                .from('tb_salesman')
                .where({ id_user });

            return user[0] ? { success: true, salesman: user[0] } : { success: false, message: 'Não foi possível recuperar o usuário / Usuário inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar o usuário!' };
        }
    }

    static async findSalesmanOrClientByUserId(id_user) {
        try {
            const user = await knex.select('tb_user.id', 'tb_user.name', 'tb_user.surname', 'tb_salesman.business_name', 'tb_user.type')
                .from('tb_user')
                .fullOuterJoin('tb_client', 'tb_client.id_user', 'tb_user.id')
                .fullOuterJoin('tb_salesman', 'tb_salesman.id_user', 'tb_user.id')
                .where((builder => {
                    builder.whereIn('tb_user.id', id_user)
                }))

            return user ? { success: true, users: user } : { success: false, message: 'Não foi possível recuperar o usuário / Usuário inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar o usuário!' };
        }
    }

    static async findOne(id) {
        try {
            const user = await knex.select('id', 'name', 'surname', 'email', 'tel', 'type', 'birthdate', 'is_deleted', 'is_verified' )
                .from('tb_user')
                .where({ id, 'is_deleted': false });
            return user[0] ? { success: true, user: user[0] } : { success: false, message: 'Não foi possível recuperar o usuário / Usuário inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar o usuário!' };
        }
    }

    static async findAll(page) {
        try {
            const user = await knex.select('tb_user.id as id', 'name', 'surname', 'email', 'tel', 'type', 'birthdate', 'tb_user.is_deleted', 'tb_client.id as id_client', 'tb_salesman.id as id_salesman')
                .from('tb_user')
                .leftJoin('tb_client', 'tb_client.id_user', 'tb_user.id')
                .leftJoin('tb_salesman', 'tb_salesman.id_user', 'tb_user.id')
                .andWhere('type', '!=', 'A') // Não mostra usuários do tipo ADM
                .orderBy(['name', 'surname'])
                .paginate({
                    perPage: 250,
                    currentPage: page,
                    isLengthAware: true
                });
                console.log(page)
            return user.data[0] ? { success: true, user } : { success: false, message: 'Não foi possível recuperar os usuários / Usuários inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar usuários!' };
        }
    }

    // Recupera a relação de tipos de usuário
    static async getUserList() {
        try {
            const user = await knex.raw('SELECT type, COUNT(type) AS quantity FROM tb_user GROUP BY type');

            return user.rows[0] ? { success: true, user: user.rows } : { success: false, message: 'Não foi possível recuperar a relação / Usuários inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao obter a relação de usuários!' };
        }
    }

    // Relação anual de usuários cadastrados
    static async getUsersByYear() {
        try {
            const user = await knex.raw("SELECT date_part('month', created_at) AS month, COUNT(created_at) as users " +
                "FROM tb_user GROUP BY month, DATE_TRUNC('year',created_at) ORDER BY month DESC LIMIT 12");

            return user.rows[0] ? { success: true, user: user.rows } : { success: false, message: 'Não foi possível recuperar a relação mensal / Usuários inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao obter a relação mensal de novos usuários!' }
        }
    }

    static async create(data) {
        try {
            const user = await knex.insert(data).table('tb_user').returning('*')

            return user[0] ? { success: true, user: user[0] } : { success: false, message: 'Não foi possível cadastrar o usuário!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Falha ao inserir usuário!' }
        }
    }

    static async update(id, data) {
        try {
            return await knex.transaction(async trx => {
                let user = await trx('tb_user').update(data).where({ id }).returning('*');
                user[0] ? delete user[0].password : undefined;
                return user[0] ? { success: true, user: user[0] } : { success: false, message: 'Nçao foi possível atualizar o usuário!' };
            })
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Usuário não atualizado!' };
        }
    }

    static async delete(id) {
        try {
            const user = await knex.update({ is_deleted: true })
                .table('tb_user')
                .where({ id })
                .returning('*');

            if(user[0].type == 'V')
                await knex.update({ is_deleted: true })
                    .table('tb_salesman')
                    .where({ id_user: user[0].id })
                    .returning('*');
            else if(user[0].type == 'C')
                await knex.update({ is_deleted: true })
                    .table('tb_client')
                    .where({ id_user: user[0].id })
                    .returning('*');

            return { success: true, message: 'Usuário deletado!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Usuário não deletado!' };
        }
    }

    static async confirmUser(id) {
        try {
            await knex.table('tb_user')
                .update({ is_verified: true })
                .where({ id });
            return { success: true };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Falha ao varificar usuário!' };
        }
    }

    static async changePassword(password, id) {
        try {
            await knex('tb_user')
                .update({ password })
                .where({ id });
            return { success: true, message: 'Senha alterada com sucesso!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Falha ao alterar a senha!' };
        }
    }
}

module.exports = User;