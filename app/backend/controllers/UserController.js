const User = require('../models/User');
const UserSchema = require('../schemas/UserSchema');
class UserController {
    static async show(req, res) {
        const id = req.params.id;
        if (isNaN(parseInt(id))) 
            return res.status(400).send({ success: false, message: 'Id inválido!' })

        const user = await User.findOne(id);
        user.success ? res.send(user) : res.status(404).send(user);
    };

    static async index(req, res) {
        let page = req.query.page;
        if (isNaN(parseInt(page))) page = 1;

        const users = await User.findAll(page);
        return users.success ? res.send(users) : res.status(404).send(users)
    };

    static async update(req, res) {
        const userSchema = await UserSchema.updateValidate();
        const { error } = userSchema.validate(req.body);

        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });


        const { id, name, surname, email, tel } = req.body;
        let userData = {};

        const user = await User.findOne(id);
        if (user.success && user.user.id && !user.user.is_deleted) {

            if(user.user.id != id)
                return res.status(401).send({success: false, message: 'Você não tem autorização!'});

            if (name && name != user.user.name) userData['name'] = name;
            if (surname && surname != user.user.surname) userData['surname'] = surname;
            if (email && email != user.user.email) {
                const existEmail = await User.findByEmail(email);
                if (existEmail.user && Object.keys(existEmail.user).length)
                    return res.status(409).send({ success: false, message: 'Email já cadastrado!' });
                userData['email'] = email;
            }

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
            res.status(400).send({ success: false, message: 'Id inválido!' })

        const user = await User.findOne(id);

        if (user.success && user.user.is_deleted || !user.success)
            res.status(400).send({ success: false, message: 'Usuário não existe!' });

        const result = await User.delete(id);
        return result.success ? res.send(result) : res.status(400).send(result);
    };
};

module.exports = UserController;