const knex = require('../database/knex');
const Message = require('../utils/Message');
const PagarMe = require('../utils/PagarMe');


let apiKey;
if (process.env.PAYMENT_MODE === 'PRODUCTION') apiKey = process.env.PRODUCTION_API;
else apiKey = process.env.SANDBOX_API;

class BankAccount {
    static async findOne(id) {
        try {
            const bankAccount = await knex('tb_bank_account')
                .join('tb_bank', 'tb_bank_account.id_bank', '=', 'tb_bank.id')
                .select('tb_bank_account.id_salesman', 'tb_bank_account.id_bank', 'tb_bank_account.document', 'tb_bank_account.holder', 'tb_bank_account.id', 'tb_bank_account.type', 'tb_bank_account.account', 'tb_bank_account.agency', 'tb_bank_account.account_dv', 'tb_bank_account.id_recipient', 'tb_bank.name as bank_name', 'tb_bank.code as bank_code')
                .where({ 'tb_bank_account.id': id, 'tb_bank_account.is_deleted': false });

            return bankAccount[0] ? { success: true, bankAccount: bankAccount[0] } : { success: false, message: 'Falha ao obter conta bancária / Conta bancária inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar a conta bancária!' };
        }
    }

    static async findBySalesman(id_salesman) {
        try {
            const bankAccount = await knex.select('*')
                .from('tb_bank_account')
                .where({ id_salesman, is_deleted: false });

            return bankAccount[0] ? { success: true, bankAccount: bankAccount[0] } : { success: false, message: 'Falha ao obter conta bancária / Conta bancária inexistente!' };
        } catch (error) {
            Message.warning(error);
            return { success: false, message: 'Houve um erro ao recuperar a conta bancária!' };
        }
    }

    static async create(data, receiver) {
        console.log(receiver);
        try {
            const result = await knex.transaction(async trx => {
                const id_recipient = await PagarMe.createRecipient(
                    receiver['name'],
                    receiver['email'],
                    receiver['bank'],
                    receiver['agency'],
                    receiver['agency_dv'],
                    receiver['account'],
                    receiver['account_dv'],
                    receiver['document'],
                    receiver['type']
                );

                data.id_recipient = id_recipient;

                const bankAccount = await trx('tb_bank_account')
                    .insert(data)
                    .returning('*');


                await trx('tb_salesman').update({ 'id_bank_account': bankAccount[0].id }).where({ id: data.id_salesman });
                return bankAccount[0];
            });

            return { success: true, bankAccount: result };
        } catch (error) {
            console.log(error)
            console.log(error.response)
            Message.warning(error.response);
            return { success: false, message: 'Houve um erro ao criar a conta bancária!' };
        }
    }

    static async update(data, receiver, id_bank_account) {
        try {
            const result = await knex.transaction(async trx => {
                const previusBankAccount = await trx('tb_bank_account').where({ 'id': id_bank_account });

                await PagarMe.updateRecipient(
                    previusBankAccount[0].id_recipient,
                    receiver['name'],
                    receiver['bank'],
                    receiver['agency'],
                    receiver['agency_dv'],
                    receiver['account'],
                    receiver['account_dv'],
                    receiver['document'],
                    receiver['type']
                );

                const bankAccount = await trx('tb_bank_account')
                .update(data)
                .where({ 'id': id_bank_account })
                .returning('*');

                return bankAccount[0];
            });

            return { success: true, bankAccount: result };
        } catch (error) {
            Message.warning(error);
            console.log(error);
            return { success: false, message: 'Houve um erro ao atualizar a conta bancária!' };
        }
    }
}

module.exports = BankAccount;
