const LoginSchema = require('../schemas/LoginSchema');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const secret = process.env.JWT_SECRET;
const saltRounds = parseInt(process.env.BCRYPT_SALT);
const jwt = require('jsonwebtoken');

class LoginController {
    static async login(req, res) {
        const schema = await LoginSchema.loginValidate();
        const { error } = schema.validate(req.body)

        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });

        const { email, password } = req.body;
        const user = await User.findUserWithPassword(email);

        if (user.success && Object.keys(user.user).length) {
            let isValid = bcrypt.compareSync(password, user.user.password)
            if (isValid) {

                if (user.user.is_deleted)
                    return res.status(401).send({ success: false, message: 'Usuário removido do sistema, entre em contato para maiores informações.' });

                if (!user.user.is_verified)
                    return res.status(403).send({ success: false, message: 'Usuário deve confirmar o email antes de fazer login!', id_user: user.user.id });

                let data = {
                    email: user.user.email,
                    type: user.user.type,
                    id_user: user.user.id,
                    name: user.user.name
                }

                if (data.type == "C") {
                    const client = await User.findClientByUserId(user.user.id);
                    if (client.success && client.client.id) data['id_client'] = client.client.id;
                    else return res.status(400).send({ success: false, message: 'Não foi possível fazer login!' })
                } else if (data.type == "V") {
                    const salesman = await User.findSalesmanByUserId(user.user.id);
                    if (salesman.success && salesman.salesman.id) data['id_salesman'] = salesman.salesman.id;
                    else return res.status(400).send({ success: false, message: 'Não foi possível fazer login!' })
                } else {
                    data['id'] = user.user.id;
                }

                const token = jwt.sign(data, secret, { expiresIn: '15d' });
                return res.status(200).send({ success: true, token, data });
            } else return res.status(401).send({ sucess: false, message: 'Senha inválida!' });
        } else return res.status(400).send({ success: false, message: 'E-mail não cadastrado!' });
    }

    static async getUserInfo(req, res) {
        const id = req.locals.id_user;
        const user = await User.findOne(id, true);

        if (user.success && Object.keys(user.user).length) {
            if (!user.user.is_verified){
                return res.status(403).send({ success: false, message: 'Usuário deve confirmar o email antes de fazer login!', id_user: user.user.id });
            }

            let data = {
                email: user.user.email,
                type: user.user.type,
                id_user: user.user.id,
                name: user.user.name
            }

            if (data.type === "C") {
                const client = await User.findClientByUserId(user.user.id);
                if (client.success && client.client.id) data['id_client'] = client.client.id;
                else return res.status(400).send({ success: false, message: 'Não foi possível fazer login!' })
            } else if (data.type === "V") {
                const salesman = await User.findSalesmanByUserId(user.user.id);
                if (salesman.success && salesman.salesman.id) data['id_salesman'] = salesman.salesman.id;
                else return res.status(400).send({ success: false, message: 'Não foi possível fazer login!' })
            } else {
                data['id'] = user.user.id;
            }

            return res.send({ success: true, user: data });
        }

        return res.status(404).send(user);
    }
}

module.exports = LoginController;