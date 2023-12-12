const Joi = require('joi');

const createValidate = () => {
    return Joi.object().keys({
        name: Joi.string().regex(/^(?!\s)(?!.*\s$)[0-9A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(1).max(50).required().messages({
            'string.pattern.base': 'Nome deve conter apenas letras, números e espaços!',
            'string.empty': 'Nome não pode ser vazio!',
            'string.min': 'Nome não pode ter menos de 1 caractere!',
            'string.max': 'Nome não pode ter mais de 50 caracteres!',
            'any.required': 'Nome é obrigatório!'
        }),
        code: Joi.number().integer().min(1).max(999).required().messages({
            'number.integer': 'Código deve ser um número inteiro!',
            'number.min': 'Código não pode ter menos que 1 dígitos!',
            'number.max': 'Código não pode ter mais que 3 dígitos!',
            'any.required': 'Código é obrigatório!'
        })
    });
}

const updateValidate = () => {
    return Joi.object().keys({
        name: Joi.string().regex(/^(?!\s)(?!.*\s$)[0-9A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(1).max(50).messages({
            'string.pattern.base': 'Nome deve conter apenas letras e espaços!',
            'string.empty': 'Nome não pode ser vazio!',
            'string.min': 'Nome não pode ter menos de 1 caractere!',
            'string.max': 'Nome não pode ter mais de 50 caracteres!',
        }),
        code: Joi.number().integer().min(1).max(999).messages({
            'number.integer': 'Código deve ser um número inteiro!',
            'number.min': 'Código não pode ter menos que 1 número!',
            'number.max': 'Código não pode ter mais que 3 números!',
        }),
        id: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id de banco deve ser um inteiro!',
            'number.min': 'Id de banco não pode ser menor que 1!',
            'number.empty': 'Id de banco não pode ser vazio!',
            'any.required': 'Id de banco é obrigatório!'
        })
    });
}

module.exports = {
    createValidate,
    updateValidate
};
