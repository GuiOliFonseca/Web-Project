const Joi = require('joi');

const createValidate = () => {
    return Joi.object().keys({
        link: Joi.string().uri().required().messages({
            'string.empty': 'Url não pode ser nula!',
            'any.required': 'Url é obrigatória!'
        }),
    });
}

const updateValidate = () => {
    return Joi.object().keys({
        link: Joi.string().uri().required().messages({
            'string.empty': 'Url não pode ser nula!',
            'any.required': 'Url é obrigatória!'
        }),
        id_banner: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id do banner deve ser um interio!',
            'number.min': 'Id do banner não pode ser menor que 1!',
            'number.empty': 'Id do banner não pode ser vazio!',
            'any.required': 'Id do banner é obrigatório!'
        }),
    });
}

module.exports = {
    updateValidate,
    createValidate
};
