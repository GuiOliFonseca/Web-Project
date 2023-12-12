const Joi = require('joi');

const createValidate = () => {
    return Joi.object().keys({
        id_order: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id de compra deve ser um inteiro!',
            'number.min': 'Id de compra não pode ser menor que 1!',
            'number.empty': 'Id de compra não pode ser vazio!',
            'any.required': 'Id de compra é obrigatório!'
        }),
        id_order_product: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id de item deve ser um inteiro!',
            'number.min': 'Id de item não pode ser menor que 1!',
            'number.empty': 'Id de item não pode ser vazio!',
            'any.required': 'Id de item é obrigatório!'
        }),
        comment: Joi.string().min(10).max(500).regex(/^\S$|^\S[ \S]*\S$/).messages({
            'string.pattern.base': 'Não são permitidos espaços no início ou no fim do comentário!',
            'string.min': 'Comentário deve possuir no mínimo 10 caracteres!',
            'string.max': 'Comentário deve possuir no máximo 500 caracteres!'
        }),
        liked: Joi.string().regex(/^[L,D]{1}$/).required().messages({
            'string.pattern.base': 'Avaliação deve variar apenas entre Like e Dislike!',
            'string.empty': 'Avaliação não pode ser nula!',
            'any.required': 'Avaliação é obrigatória!'
        })
    });
}

module.exports = { createValidate };