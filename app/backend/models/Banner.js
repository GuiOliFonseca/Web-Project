const Message = require('../utils/Message');
const knex = require('../database/knex');
class Banner{
    static async findAll(){
        try {
            const banners = await knex('tb_banner').select('*');
            return banners[0] ? {success: true, banners: banners} : {success: false, massage: 'Houve um erro ao recuperar os banners'};
        } catch (error) {
            Message.warning(error.message);
            return {success: false, message: error.message}
        }
    }

    static async findOne(id){
        try {
            const banner = await knex('tb_banner').select('*').where({id});
            return banner[0] ? {success: true, banner: banner[0]} : {success: false, massage: 'Houve um erro ao recuperar o banner'};
        } catch (error) {
            Message.warning(error.message);
            return {success: false, message: error.message};
        }
    }

    static async create(data){
        try {
            const banner = await knex('tb_banner').insert(data).returning('*');
            return banner ? {success: true, banner: banner} : {success: false, massage: 'Houve um erro ao criar o banner'};
        } catch (error) {
            Message.warning(error.message);
            return {success: false, message: error.message}
        }
    }

    static async update(id_banner, data){
        try {
            const banner = await knex('tb_banner').update(data).where({id: id_banner}).returning('*');
            return banner ? {success: true, banner: banner} : {success: false, massage: 'Houve um erro ao atualizar o banner'};
        } catch (error) {
            Message.warning(error.message);
            return {success: false, message: error.message}
        }
    }

    static async delete(id_banner){
        try {
            const banner = await knex('tb_banner').delete().where({id: id_banner}).returning('*');
            return banner ? {success: true, message: 'Banner apagado!'} : {success: false, massage: 'Houve um erro ao apagar o banner'};
        } catch (error) {
            Message.warning(error.message);
            return {success: false, message: error.message}
        }
    }
}

module.exports = Banner;