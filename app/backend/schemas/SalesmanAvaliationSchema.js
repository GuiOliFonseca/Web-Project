const Joi = require('joi');

const createValidate = () => {
    return Joi.object().keys({
        liked: Joi.string().regex(/^[L,D]{1}$/).required().messages({
            'string.pattern.base': 'Avaliação deve variar apenas entre Like e Dislike!',
            'string.empty': 'Avaliação não pode ser nula!',
            'any.required': 'Avaliação é obrigatória!'
        }),
        comment: Joi.string().min(10).max(500).regex(/^\S$|^\S[ \S]*\S$/).messages({
            'string.pattern.base': 'Não são permitdos espaços no início ou no fim do comentário!',
            'string.min': 'Comentário deve possuir no mínimo 10 caracteres!',
            'string.max': 'Comentário deve possuir no máximo 500 caracteres!'
        }),
        id_order_product: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id do item da order deve ser um interio',
            'number.min': 'Id do item da order não pode ser menor que 1',
            'number.empty': 'Id do item da order não pode ser vazio',
            'any.required': 'Id do item da order é obrigatório'
        }),
        id_client: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id comprador deve ser um interio',
            'number.min': 'Id comprador não pode ser menor que 1',
            'number.empty': 'Id comprador não pode ser vazio',
            'any.required': 'Id comprador é obrigatório'
        }),
        id_salesman: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id vendedor deve ser um interio',
            'number.min': 'Id vendedor não pode ser menor que 1',
            'number.empty': 'Id vendedor não pode ser vazio',
            'any.required': 'Id vendedor é obrigatório'
        })
    });
}

module.exports = {
    createValidate
};
