const Message = require('../utils/Message');
const knex = require("../database/knex");

class Admin {
    static async findOne(id){
        try {
            const admin = await knex.select('id', 'name', 'surname', 'email', 'tel', 'type', 'birthdate', 'is_deleted')
                .from('tb_user')
                .where({ id, 'is_deleted': false, 'type': 'A' });
            return admin[0] ? { success: true, user: admin[0] } : { success: false, message: 'Não foi possível recuperar o admin / Admin inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar o admin!' };
        }
    }

    static async findAll(page){
        try {
            const admin = await knex.select('id', 'name', 'surname', 'email', 'tel', 'type', 'birthdate', 'is_deleted')
                .from('tb_user')
                .where({ 'is_deleted': false, 'type': 'A' })
                .orderBy(['name', 'surname'])
                .paginate({
                    perPage: 20,
                    currentPage: page
                });

            return admin.data[0] ? { success: true, admin } : { success: false, message: 'Não foi possível recuperar os admins / Admins inexistentes!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar admins!' };
        }
    }

    static async sendMessage(message){
        try {
            await knex('tb_message').insert(message);
            global.io.emit('notification', { notification: message });
            return { success: true }
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao inserir mensagem!' };
        }
    }

    static async findAllMessage(){
        try {
            const messages = await knex.select('*')
                .from('tb_message')
                .orderBy('id', 'DESC')
                .limit(30)

            return messages ? { success: true, messages } : { success: false, message: 'Não foi possível recuperar as mensagens!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar as mensagens!' };
        }
    }
}

module.exports = Admin;