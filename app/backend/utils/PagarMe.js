const PAYMENT_URL = 'https://api.pagar.me/core/v5';

const PAYMENT_HEADERS = {
    'Authorization': 'Basic ' +
        Buffer.from(`${(process.env.PAYMENT_MODE === 'PRODUCTION') ?
            process.env.PRODUCTION_PRIVATE_KEY :
            process.env.SANDBOX_PRIVATE_KEY}:`).toString('base64'),
    'Content-Type': 'application/json'
};

class PagarMe {
    static async run(method, data, endpoint) {
        const options = {
            method: method,
            headers: PAYMENT_HEADERS,
            body: JSON.stringify(data)
        };

        const response = await fetch(`${PAYMENT_URL}/${endpoint}`, options);
        const jsonr = await response.json();
        console.log(JSON.stringify(jsonr));
        if (response.status != 200) {
            return { success: false };
        }

        
        return { sucess: true, data: jsonr }
    }

    static async createRecipient(name, email, bank, agency, agency_dv, account, account_dv, document, type) {

        let account_type = '';
        if (type === 'CCI' || type === 'CCJ')
            account_type = 'checking';
        else
            account_type = 'savings';

        bank = `${bank}`.slice(`${bank}`.length - 3);
        let data = {
            default_bank_account: {
                holder_name: `${name}`,
                bank: bank,
                branch_number: `${agency}`,
                account_number: `${account}`,
                account_check_digit: `${account_dv}`,
                holder_type: 'company',
                holder_document: `${document}`,
                type: `${account_type}`
            },
            transfer_settings: {
                transfer_enabled: true,
                transfer_interval: 'weekly',
                transfer_day: 1
            },
            name: `${name}`,
            email: `${email}`,
            document: `${document}`,
            type: 'company'
        };

        if (typeof agency_dv != 'undefined' && agency_dv != '') {
            data = {
                default_bank_account: {
                    holder_name: `${name}`,
                    bank: bank,
                    branch_number: `${agency}`,
                    branch_check_digit: `${agency_dv}`,
                    account_number: `${account}`,
                    account_check_digit: `${account_dv}`,
                    holder_type: 'company',
                    holder_document: `${document}`,
                    type: `${account_type}`
                },
                transfer_settings: {
                    transfer_enabled: true,
                    transfer_interval: 'Monthly',
                    transfer_day: 5
                },
                name: `${name}`,
                email: `${email}`,
                document: `${document}`,
                type: 'company'
            };
    
        }

        const response = await PagarMe.run('POST', data, 'recipients');
        if (response['sucess'])
            return response['data']['id'];

        throw 'Não foi possivel cadastrar conta bancaria no pagar.me.';
    }

    static async updateRecipient(recipient_id, name, bank, agency, agency_dv, account, account_dv, document, type) {
        let account_type = '';
        if (type === 'CCI' || type === 'CCJ')
            account_type = 'checking';
        else
            account_type = 'savings';

        bank = `${bank}`.slice(`${bank}`.length - 3);

        let data = {
            bank_account: {
                holder_name: `${name}`,
                bank: `${bank}`,
                branch_number: `${agency}`,
                account_number: `${account}`,
                account_check_digit: `${account_dv}`,
                holder_type: 'company',
                holder_document: `${document}`,
                type: `${account_type}`
            },
        };

        if (typeof agency_dv != 'undefined' && agency_dv != '') {
            data = {
                bank_account: {
                    holder_name: `${name}`,
                    bank: `${bank}`,
                    branch_number: `${agency}`,
                    branch_check_digit: `${agency_dv}`,
                    account_number: `${account}`,
                    account_check_digit: `${account_dv}`,
                    holder_type: 'company',
                    holder_document: `${document}`,
                    type: `${account_type}`
                },
            };
        }

        const response = await PagarMe.run('PATCH', data, `recipients/${recipient_id}/default-bank-account`);

        if (!response['sucess'])
            throw 'Não foi possivel atualizar conta bancaria no pagar.me.';
    }

    static async createSplitPayment(items, customer, payments) {
        const data = {
            items: items,
            customer: customer,
            payments: payments
        }

        const response = await PagarMe.run('POST', data, 'orders');

        if (response['sucess'])
            return response['data'];

        throw 'Não foi possivel criar o pagamento.';
    }
}

module.exports = PagarMe;