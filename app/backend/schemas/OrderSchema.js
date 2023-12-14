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
        id_address: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id do endereço deve ser um interio!',
            'number.min': 'Id do endereço não pode ser menor que 1!',
            'number.empty': 'Id do endereço não pode ser vazio!',
            'any.required': 'Id do endereço é obrigatório!'
        }),
    });
}

module.exports = {
    createValidate
};
