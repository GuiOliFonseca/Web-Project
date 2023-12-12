const Joi = require('joi');

const createValidate = () => {
    return Joi.object().keys({
        id_client: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id do comprador deve ser um interio!',
            'number.min': 'Id do comprador não pode ser menor que 1!',
            'number.empty': 'Id do comprador não pode ser vazio!',
            'any.required': 'Id do comprador é obrigatório!'
        }),
        id_user: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id do usuário deve ser um interio!',
            'number.min': 'Id do usuário não pode ser menor que 1!',
            'number.empty': 'Id do usuário não pode ser vazio!',
            'any.required': 'Id do usuário é obrigatório!'
        }),
        products: Joi.array().items({ id_product: Joi.number().integer(), quantity: Joi.number().integer(), id_salesman: Joi.number().integer(), price: Joi.number() }).min(1).required().messages({
            'array.empty': 'Produtos não podem ser vazio!',
            'array.min': 'Deve ter pelo menos um produto!',
            'any.required': 'Produtos são obrigatórios!',
            'array.includesRequiredKnowns': 'Deve ter pelo menos um produto!'
        }),
        tax_total: Joi.number().required().messages({
            'number.empty': 'Taxas não pode ser vazio!',
            'any.required': 'Taxas é obrigatório!'
        }),
        id_address: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id do endereço deve ser um interio!',
            'number.min': 'Id do endereço não pode ser menor que 1!',
            'number.empty': 'Id do endereço não pode ser vazio!',
            'any.required': 'Id do endereço é obrigatório!'
        }),
        portions: Joi.number().integer().min(1).max(12).when(
            'method',
            {
                is: 'C',
                then: Joi.required().messages({
                    'any.required': 'Número de parcelas é obrigatório quando o método é cartão!'
                })
            })
            .messages({
                'number.integer': 'Parceelas deve ser um interio!',
                'number.min': 'Parcelas não pode ser menor que 0!',
                'number.max': 'Parcelas não pode ser maior que 12!',
                'number.empty': 'Parcelas não pode ser vazio!',
            }),
        document: Joi.string().required().messages({
            'string.empty': 'Documento não pode ser vazio!',
            'any.required': 'Documento é obrigatório!'
        }),

        name: Joi.string().regex(/^(?!\s)(?!.*\s$)[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).max(100).when(
            'method',
            {
                is: 'B' || 'P',
                then: Joi.required().messages({
                    'any.required': 'Nome é obrigatório quando o método de pagamento é boleto ou pix!'
                })
            })
            .messages({
                'string.empty': 'Nome não pode ser vazio',
                'string.pattern.base': 'Nome deve conter apenas letras e espaços',
                'string.max': 'Nome não pode ter mais que 100 caracteres!'
            }),
        /**
         * P -> PIX payment method
         * C -> CREDIT payment method
         * B -> Boleto payment method
         */
        method: Joi.string().regex(/^[P,C,B]{1}$/).required().messages({
            'string.pattern.base': 'Método de pagamento deve ser P, C ou B!',
            'string.empty': 'Método de pagamento não pode ser vazio!',
            'any.required': 'Método de pagamento é obrigatório!'
        }),
        card_hash: Joi.string().when(
            'method',
            {
                is: 'C',
                then: Joi.required().messages({
                    'any.required': 'Dados do cartão são obrigatórios quando o método de pagamento é cartão!'
                })
            }
        ).messages({
            'string.empty': 'Dados do cartão não podem ser vazios!',
        })
    });
}

module.exports = {
    createValidate
};
