const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.BCRYPT_SALT);
const AdminSchema = require('../schemas/AdminSchema');

class AdminController {
    static async index(req, res) {
        let page = req.query.page;

        if (isNaN(parseInt(page))) page = '1';

        const admin = await Admin.findAll(page);
        return admin.success ? res.send(admin) : res.status(404).send(users)
    };

    static async show(req, res) {
        const id = req.params.id;
        if (isNaN(parseInt(id)))
            return res.status(400).send({ success: false, message: 'Id inválido!' })

        const admin = await Admin.findOne(id);
        return admin.success ? res.send(admin) : res.status(404).send(admin);
    };

    static async countTypeUsers(req, res) {
        const result = await User.getUserList();

        if(result.success) {
            for (const data of result.user) {
                if (data.type === 'A') data.type = 'Administrador';
                else if (data.type === 'C') data.type = 'Cliente';
                else data.type = 'Vendedor';
            }
            return res.send(result);
        }
        return res.status(400).send(result);
    }

    static async countUsersAtYear(req, res) {
        const result = await User.getUsersByYear();

        if (result.success) {
            for (const data of result.user) {
                switch (data.month) {
                    case 1: data.month = 'Janeiro'; break;
                    case 2: data.month = 'Fevereiro'; break;
                    case 3: data.month = 'Março'; break;
                    case 4: data.month = 'Abril'; break;
                    case 5: data.month = 'Maio'; break;
                    case 6: data.month = 'Junho'; break;
                    case 7: data.month = 'Julho'; break;
                    case 8: data.month = 'Agosto'; break;
                    case 9: data.month = 'Setembro'; break;
                    case 10: data.month = 'Outubro'; break;
                    case 11: data.month = 'Novembro'; break;
                    case 12: data.month = 'Dezembro'; break;
                }
            }
            return res.send(result);
        }
        return res.status(400).send(result);
    }

    static async create(req, res) {
        const schema = AdminSchema.createValidate();
        const { error } = schema.validate(req.body);

        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });

        const { name, surname, email, password, tel, birthdate } = req.body;

        let user = {
            name,
            surname,
            email,
            tel,
            birthdate
        }

        const existEmail = await User.findByEmail(email);
        if (existEmail.success && Object.keys(existEmail.user).length)
            return res.status(400).send({ success: false, message: 'Email já cadastrado!' });

        const existTel = await User.findByTel(tel);
        if (existTel.success && Object.keys(existTel.user).length)
            return res.status(400).send({ success: false, message: 'Telefone já cadastrado!' });

        const salt = bcrypt.genSaltSync(saltRounds);
        user.password = bcrypt.hashSync(password, salt);
        user.type = 'A';

        const result = await User.create(user);
        return result.success ? res.status(201).send(result) : res.status(404).send(result);
    };

    static async update(req, res) {
        const adminSchema = await AdminSchema.updateValidate();
        const { error } = adminSchema.validate(req.body);

        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });

        const { id, name, surname, email, tel } = req.body;
        let userData = {};

        const user = await User.findOne(id);
        if (user.success && user.user.id && !user.user.is_deleted) {

            if (name && name != user.user.name) userData['name'] = name;
            if (surname && surname != user.user.surname) userData['surname'] = surname;
            if (email && email != user.user.email) {
                const existEmail = await User.findByEmail(email);
                if (existEmail.user && Object.keys(existEmail.user).length)
                    return res.status(409).send({ success: false, message: 'Email já cadastrado!' });
                userData['email'] = email;
            }

            if (user.user.type != 'A')
                return res.status(404).send({ success: false, message: 'Usuário não é um administrador!' });

            if (tel && tel != user.user.tel) {
                const existTel = await User.findByTel(tel);
                if (existTel.user && Object.keys(existTel.user).length)
                    return res.status(409).send({ success: false, message: 'Telefone já cadastrado!' });
                userData['tel'] = tel;
            }

            const result = Object.keys(userData).length ? await User.update(id, userData) : user;
            return result.success ? res.send(result) : res.status(400).send(result);
        } else return res.status(409).send({ success: false, message: 'Id inválido!' });
    };

    static async delete(req, res) {
        const id = req.params.id;

        if (isNaN(parseInt(id)))
            return res.status(400).send({ success: false, message: 'Id inválido!' });

        const user = await User.findOne(id);

        if (user.success && user.user.is_deleted || !user.success)
            return res.status(400).send({ success: false, message: 'Usuário não existe!' });

        const result = await User.delete(id);
        return result.success ? res.send(result) : res.status(400).send(result);
    };

    static async sendMessage(req, res){
        const {message} = req.body;

        if(!message)
            return res.status(400).send({success: false, message: 'Mensagem é obrigatória!'});
        console.log(message)
        const result = await Admin.sendMessage({message});
        return result.success ? res.send({success: true}) : res.status(400).send({success: false, message: 'Houve um erro ao mandar mensagem!'});
    }

    static async indexMessage(req, res){
        const messages = await Admin.findAllMessage();
        return messages.success ? res.send(messages) : res.status(400).send(messages);
    }
};

module.exports = AdminController;