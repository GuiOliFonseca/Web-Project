const Client = require('../models/Client');
const ClientSchema = require('../schemas/ClientSchema');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.BCRYPT_SALT);
const CPF = require('cpf');
const CNPJ = require('cnpj');
const OrderProduct = require('../models/OrderProduct');

class ClientController {
    static async index(req, res) {
        let page = req.query.page;

        if (isNaN(parseInt(page))) page = '1';

        const client = await Client.findAll(page);
        return client.success ? res.send(client) : res.status(404).send(client);
    };

    static async show(req, res) {
        const id = req.params.id;

        if (isNaN(parseInt(id)))
            return res.status(400).send({ success: false, message: 'Id do cliente inválido!' })


        const client = await Client.findOne(id);
        return client.success ? res.send(client) : res.status(404).send(client);
    };

    static async create(req, res) {
        const { name, surname, email, tel, password, birthdate } = req.body;
        let { cpf, cnpj } = req.body;

        let user = {
            name,
            surname,
            email,
            tel,
            birthdate
        }
        const client = {
            cpf,
            cnpj
        }

        const userSchema = ClientSchema.createValidate();
        const { error } = userSchema.validate(req.body);

        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });


        user.type = 'C';

        const existEmail = await User.findByEmail(email);
        if (existEmail.user && Object.keys(existEmail.user).length)
            return res.status(409).send({ success: false, message: 'Email já cadastrado!' });


        if (!cnpj) cnpj = '0';
        if (!cpf) cpf = '0';

        if (!CPF.isValid(cpf) && !CNPJ.validate(cnpj))
            return res.status(400).send({ success: false, message: 'CPF ou CNPJ deve ser válido!' });


        const existCnpj = await Client.findByCnpjOrCpf(cpf, cnpj);
        if (existCnpj.client && Object.keys(existCnpj.client).length)
            return res.status(409).send({ success: false, message: 'CNPJ/CPF já cadastrado!' });


        const existTel = await User.findByTel(tel);
        if (existTel.user && Object.keys(existTel.user).length)
            return res.status(409).send({ success: false, message: 'Telefone já cadastrado!' });


        const salt = bcrypt.genSaltSync(saltRounds);
        user.password = bcrypt.hashSync(password, salt);

        const result = await Client.create(user, client);

        if (result.success) res.status(201).send(result)
        else res.status(400).send(result);
    };

    static async update(req, res) {
        const userSchema = ClientSchema.updateValidate();
        const { error } = userSchema.validate(req.body);

        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });

        const { id_client, name, surname, email, tel } = req.body;

        let userData = {};

        const client = await Client.findOne(id_client);

        if (client.success && client.client.id_client && !client.client.is_deleted) {

            const user_id = client.client.id_user;
            const client_id = client.client.id_client;

            if (name && name !== client.client.name) userData.name = name;

            if (surname && surname !== client.client.surname) userData.surname = surname;

            if (email && email !== client.client.email) {
                const existEmail = await User.findByEmail(email);
                if (existEmail.user && Object.keys(existEmail.user).length)
                    return res.status(409).send({ success: false, message: 'Email já cadastrado!' });

                userData.email = email;
            }

            if (tel && tel !== client.client.tel) {
                const existTel = await User.findByTel(tel);
                if (existTel.user && Object.keys(existTel.user).length)
                    return res.status(409).send({ success: false, message: 'Telefone já cadastrado!' });


                userData.tel = tel;
            }

            const result = await Client.update(user_id, client_id, userData, {});
            if (result.success) {
                const updatedClient = await Client.findOne(client_id);
                return updatedClient.success ? res.send(updatedClient) : res.status(400).send(updatedClient);
            } else return res.status(400).send(result);
        } else return res.status(404).send({ success: false, message: 'Cliente inexistente!' });
    };

    static async delete(req, res) {
        const id = req.params.id;
        if (isNaN(parseInt(id)))
            return res.status(400).send({ success: false, message: 'Id de cliente inválido!' });


        const client = await Client.findOne(id);

        if (!client.success ||
            (client.success && !Object.keys(client.client).length) ||
            (client.success && Object.keys(client.client).length && client.client.is_deleted)) {

            return res.status(404).send({ success: false, message: 'Cliente inexistente!' });
        }

        const numOrdersToBeReceived = await OrderProduct.countSaleStatusByClient(id, 'R', false);
        if (numOrdersToBeReceived.success) {
            console.log(numOrdersToBeReceived.numOrders);
            if (numOrdersToBeReceived.numOrders > 0)
                return res.status(409).send({ success: false, message: 'A conta não pode ser deletada, pois ainda existem pedidos a serem recebidos pelo cliente!' });
        } else {
            return res.status(400).send(numOrdersToBeReceived);
        }

        const result = await Client.delete(client.client.id_user, client.client.id_client);
        return result ? res.send(result) : res.status(400).send(result);
    };
};

module.exports = ClientController;
