const BankAccount = require('../models/BankAccount');
const BankAccountSchema = require('../schemas/BankAccountSchema');
const Bank = require('../models/Bank');
const Salesman = require('../models/Salesman');

const CPF = require('cpf');
const CNPJ = require('cnpj');

class BankAccountController {
    static async show(req, res) {
        const id_salesman = req.params.id_salesman;

        if (isNaN(parseInt(id_salesman)))
            return res.status(400).send({ success: false, message: 'Id do vendedor inválido!' })

        const bankAccount = await BankAccount.findBySalesman(id_salesman);
        if (bankAccount.success && req.locals.id_salesman != bankAccount.bankAccount.id_salesman)
            return res.status(401).send({ success: false, message: 'Acesso não autorizado!' });

        return bankAccount.success ? res.send(bankAccount) : res.status(404).send(bankAccount);
    }

    static async create(req, res) {
        const schema = BankAccountSchema.createValidate();
        const { error } = schema.validate(req.body);

        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });

        const { id_salesman, id_bank, account_dv, type, agency, agency_dv, account } = req.body;

        const existBankAccount = await BankAccount.findBySalesman(id_salesman);
        if (existBankAccount.success)
            return res.status(409).send({ success: false, message: 'Já existe uma conta associada a este vendedor!' });

        const existBank = await Bank.findOne(id_bank);
        if (!existBank.success)
            return res.status(404).send(existBank);

        const existSalesman = await Salesman.findOne(id_salesman);
        if (!existSalesman.success)
            return res.status(404).send(existSalesman);

        if (!existSalesman.salesman.is_verified)
            return res.status(409).send({ success: false, message: 'É necessário estar verificado para cadastrar uma conta!' });

        req.body.document = req.body.document.replace(/[.\/-]/g, '');

        if (!CPF.isValid(req.body.document) && !CNPJ.validate(req.body.document)) {
            return res.status(400).send({ success: false, message: 'O documento informado é inválido!' });
        }

        let tp = '';
        switch (type) {
            case 'CCI':
                tp = 'conta_corrente';
                break;
            case 'CCJ':
                tp = 'conta_corrente_conjunta';
                break;
            case 'CPI':
                tp = 'conta_poupanca';
                break;
            case 'CPJ':
                tp = 'conta_poupanca_conjunta';
                break;
        }

        req.body.holder = req.body.holder.toUpperCase();

        const receiver = {
            name: req.body.holder,
            email: existSalesman.salesman.email,
            bank: existBank.bank.code,
            agency: agency,
            agency_dv: agency_dv,
            account: account,
            account_dv: account_dv,
            document: req.body.document,
            type: type,
        }

        const bankAccount = await BankAccount.create(req.body, receiver);
        return bankAccount.success ? res.status(201).send(bankAccount) : res.status(400).send(bankAccount);
    }

    static async update(req, res) {
        const schema = BankAccountSchema.updateValidate();
        const { error } = schema.validate(req.body);

        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });

        const { id_bank_account, id_bank, account_dv, type, agency, agency_dv, account } = req.body;

        const existBankAccount = await BankAccount.findOne(id_bank_account);

        if (existBankAccount.success) {
            if (req.locals.type !== 'A' && req.locals.id_salesman !== existBankAccount.bankAccount.id_salesman)
                return res.status(401).send({ success: false, message: 'Acesso não autorizado!' });
            const bnk = {};
            let toUpdate = {};

            const existSalesman = await Salesman.findOne(existBankAccount.bankAccount.id_salesman);
            if (!existSalesman.success)
                return res.status(404).send(salesman);


            req.body.holder = req.body.holder.toUpperCase();
            if (req.body.holder !== existBankAccount.bankAccount.holder) toUpdate.holder = req.body.holder;
            bnk.legal_name = req.body.holder;

            req.body.document = req.body.document.replace(/[.\/-]/g, '');
            if (req.body.document !== existBankAccount.bankAccount.document) {
                return res.status(400).send({ success: false, message: 'A nova conta bancária deve ter o mesmo documento que a conta anterior!' })
            }

            bnk.document_number = existBankAccount.bankAccount.document;

            const existBank = await Bank.findOne(id_bank);
            if (existBank.success) {
                bnk.bank_code = existBank.bank.code;

                if (existBankAccount.bankAccount.id_bank !== id_bank) toUpdate.id_bank = id_bank;
            }

            if (agency !== existBankAccount.bankAccount.agency) toUpdate.agency = agency;
            bnk.agencia = agency;

            if (agency_dv !== existBankAccount.bankAccount.agency_dv) toUpdate.agency_dv = agency_dv;
            bnk.agencia_dv = agency_dv;

            if (account !== existBankAccount.bankAccount.account) toUpdate.account = account;
            bnk.conta = account;

            if (account_dv !== existBankAccount.bankAccount.account_dv) toUpdate.account_dv = account_dv;
            bnk.conta_dv = account_dv;

            if (type !== existBankAccount.bankAccount.type) toUpdate.type = type;
            bnk.tipo = type;

            if (Object.keys(toUpdate).length) {
                toUpdate.id = id_bank_account;

                const receiver = {
                    name: bnk.legal_name,
                    bank: bnk.conta,
                    agency: bnk.agencia,
                    agency_dv: bnk.agencia_dv,
                    account: bnk.conta,
                    account_dv: bnk.conta_dv,
                    document: bnk.document_number,
                    type: bnk.tipo,
                }

                const result = await BankAccount.update(toUpdate, receiver, id_bank_account);

                return result.success ? res.send(result) : res.status(400).send(result);
            }
            return res.send(existBankAccount);
        }
        return res.status(404).send(existBankAccount);
    };
}
module.exports = BankAccountController;
