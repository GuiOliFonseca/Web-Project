const Bank = require('../models/Bank');
const BankSchema = require('../schemas/BankSchema');

class BankController {
    static async index(req, res) {
        const banks = await Bank.findAll();
        return banks.success ? res.send(banks) : res.status(404).send(banks);
    }

    static async show(req, res) {
        const id = req.params.id;

        if (isNaN(parseInt(id)))
            return res.status(400).send({ success: false, message: 'Id de banco inválido!' });

        const bank = await Bank.findOne(id);
        return bank.success ? res.send(bank) : res.status(404).send(bank);
    }

    static async create(req, res) {
        const schema = BankSchema.createValidate();
        const { error } = schema.validate(req.body);

        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });

        const { name, code } = req.body;
        const data = {
            name,
            code
        }

        const existCode = await Bank.findByCode(code);
        if (existCode.success)
            return res.status(409).send({ success: false, message: 'Código já cadastrado!' });

        const result = await Bank.create(data);
        return result.success ? res.status(201).send(result) : res.status(404).send(result);
    }

    static async update(req, res) {
        const schema = BankSchema.updateValidate();
        const { error } = schema.validate(req.body);

        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });

        const { id, name, code } = req.body;
        const form = {
            id,
            name,
            code
        };

        const bank = await Bank.findOne(form.id);

        if (bank.success) {
            const toUpdate = {};

            if (form.name && bank.name !== form.name) {
                toUpdate.name = form.name;
            }

            if (form.code && bank.code !== form.code) {
                const existCode = await Bank.findByCode(form.code);
                if (existCode.success)
                    return res.status(409).send({ success: false, message: 'Código de banco já cadastrado!' });

                toUpdate.code = form.code;
            }

            if (Object.keys(toUpdate).length) {
                toUpdate.id = form.id;

                const result = await Bank.update(toUpdate);
                return result.success ? res.send(result) : res.status(400).send(result);
            }
            return res.send({ success: true, bank });
        }
        return res.status(404).send({ success: false, message: 'O banco não existe!' });
    }

    static async delete(req, res) {
        const id = req.params.id;

        if (isNaN(parseInt(id)))
            return res.status(400).send({ success: false, message: 'Id de banco inválido!' });

        const bank = await Bank.findOne(id);
        if (!bank.success)
            return res.status(404).send({ success: false, message: 'Banco inexistente!' });

        const result = await Bank.delete(id);
        return result.success ? res.send(result) : res.status(404).send(result);
    }
}

module.exports = BankController;
