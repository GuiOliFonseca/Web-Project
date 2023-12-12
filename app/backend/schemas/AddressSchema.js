const Joi = require('joi');

const createValidate = () => {
    return Joi.object().keys({
        id_user: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id usuário deve ser um inteiro!',
            'number.min': 'Id usuário não pode ser menor que 1!',
            'number.empty': 'Id usuário não pode ser vazio!',
            'any.required': 'Id usuário é obrigatório!'
        }),
        alias: Joi.string().regex(/^(?!\s)(?!.*\s$)[0-9A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(1).max(50).required().messages({
            'string.pattern.base': 'Apelido deve conter apenas letras, números e espaços!',
            'string.empty': 'Apelido não pode ser vazio!',
            'string.min': 'Apelido não pode ter menos de 1 caractere!',
            'string.max': 'Apelido não pode ter mais de 50 caracteres!',
            'any.required': 'Apelido é obrigatório!'
        }),
        street: Joi.string().regex(/^(?!\s)(?!.*\s$)[0-9A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(1).max(100).required().messages({
            'string.pattern.base': 'Rua deve conter apenas letras, números e espaços!',
            'string.empty': 'Rua não pode ser vazio!',
            'string.min': 'Rua não pode ter menos de 1 caractere!',
            'string.max': 'Rua não pode ter mais de 100 caracteres!',
            'any.required': 'Rua é obrigatório!'
        }),
        num: Joi.string().regex(/^([0-9]+[A-Za-z]*)|(SN)$/).required().messages({
            'string.pattern.base': 'Número deve conter pelo menos um número ou SN e pode ser seguido de letras!',
            'string.empty': 'Número não pode ser vazio!',
            'any.required': 'Número é obrigatório!'
        }),
        neigh: Joi.string().regex(/^(?!\s)(?!.*\s$)[0-9A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(1).max(100).required().messages({
            'string.pattern.base': 'Bairro deve conter apenas letras, números e espaços!',
            'string.empty': 'Bairro não pode ser vazio!',
            'string.min': 'Bairro não pode ter menos de 1 caractere!',
            'string.max': 'Bairro não pode ter mais de 100 caracteres!',
            'any.required': 'Bairro é obrigatório!'
        }),
        complement: Joi.string().regex(/^(?!\s)(?!.*\s$)[0-9A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).max(100).messages({
            'string.pattern.base': 'Complemento deve conter apenas letras, números e espaços!',
            'string.max': 'Complemento não pode ter mais de 100 caracteres!',
        }),
        city: Joi.string().regex(/^(?!\s)(?!.*\s$)[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(1).max(60).required().messages({
            'string.pattern.base': 'Cidade deve conter apenas letras, números e espaços!',
            'string.empty': 'Cidade não pode ser vazio!',
            'string.min': 'Cidade não pode ter menos de 1 caractere!',
            'string.max': 'Cidade não pode ter mais de 60 caracteres!',
            'any.required': 'Cidade é obrigatório!'
        }),
        state: Joi.string().regex(/^(?!\s)(?!.*\s$)[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).length(2).required().messages({
            'string.pattern.base': 'Estado deve conter apenas letras!',
            'string.empty': 'Estado não pode ser vazio!',
            'string.length': 'Estado devete ter 2 caracteres!',
            'any.required': 'Estado é obrigatório!'
        }),
        country: Joi.string().regex(/^(?!\s)(?!.*\s$)[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(1).max(60).required().messages({
            'string.pattern.base': 'País deve conter apenas letras, números e espaços!',
            'string.empty': 'País não pode ser vazio!',
            'string.min': 'País não pode ter menos de 1 caractere!',
            'string.max': 'País não pode ter mais de 60 caracteres!',
            'any.required': 'País é obrigatório!'
        }),
        zipcode: Joi.string().regex(/^[0-9]+$/).length(8).required().messages({
            'number.integer': 'CEP deve ser um número inteiro!',
            'number.min': 'CEP precisa  no mínimo 8 digitos!',
            'number.max': 'CEP precisa  no máximo 8 digitos!',
            'any.required': 'CEP é obrigatório!'
        })
    });
}

const updateValidate = () => {
    return Joi.object().keys({
        id: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id usuário deve ser um inteiro!',
            'number.min': 'Id usuário não pode ser menor que 1!',
            'number.empty': 'Id usuário não pode ser vazio!',
            'any.required': 'Id usuário é obrigatório!'
        }),
        alias: Joi.string().regex(/^(?!\s)(?!.*\s$)[0-9A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(1).max(100).messages({
            'string.pattern.base': 'Apelido deve conter apenas letras, números e espaços!',
            'string.empty': 'Apelido não pode ser vazio!',
            'string.min': 'Apelido não pode ter menos de 1 caractere!',
            'string.max': 'Apelido não pode ter mais de 100 caracteres!',
        }),
        street: Joi.string().regex(/^(?!\s)(?!.*\s$)[0-9A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(1).max(100).messages({
            'string.pattern.base': 'Rua deve conter apenas letras, números e espaços!',
            'string.empty': 'Rua não pode ser vazio!',
            'string.min': 'Rua não pode ter menos de 1 caractere!',
            'string.max': 'Rua não pode ter mais de 100 caracteres!',
        }),
        num: Joi.string().regex(/^([0-9]+[A-Za-z]*)|(SN)$/).messages({
            'string.pattern.base': 'Número deve conter pelo menos um número ou SN e pode ser seguido de letras!',
            'string.empty': 'Número não pode ser vazio!'
        }),
        neigh: Joi.string().regex(/^(?!\s)(?!.*\s$)[0-9A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(1).max(100).messages({
            'string.pattern.base': 'Bairro deve conter apenas letras, números e espaços!',
            'string.empty': 'Bairro não pode ser vazio!',
            'string.min': 'Bairro não pode ter menos de 1 caractere!',
            'string.max': 'Bairro não pode ter mais de 100 caracteres!',
        }),
        complement: Joi.string().regex(/^(?!\s)(?!.*\s$)[0-9A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).max(100).messages({
            'string.pattern.base': 'Complemento deve conter apenas letras, números e espaços!',
            'string.max': 'Complemento não pode ter mais de 100 caracteres!',
        }),
        city: Joi.string().regex(/^(?!\s)(?!.*\s$)[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(1).max(60).messages({
            'string.pattern.base': 'Cidade deve conter apenas letras, números e espaços!',
            'string.empty': 'Cidade não pode ser vazio!',
            'string.min': 'Cidade não pode ter menos de 1 caractere!',
            'string.max': 'Cidade não pode ter mais de 60 caracteres!',
        }),
        state: Joi.string().regex(/^(?!\s)(?!.*\s$)[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(1).max(60).messages({
            'string.pattern.base': 'Estado deve conter apenas letras, números e espaços!',
            'string.empty': 'Estado não pode ser vazio!',
            'string.min': 'Estado não pode ter menos de 1 caractere!',
            'string.max': 'Estado não pode ter mais de 60 caracteres!',
        }),
        country: Joi.string().regex(/^(?!\s)(?!.*\s$)[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(1).max(60).messages({
            'string.pattern.base': 'País deve conter apenas letras, números e espaços!',
            'string.empty': 'País não pode ser vazio!',
            'string.min': 'País não pode ter menos de 1 caractere!',
            'string.max': 'País não pode ter mais de 60 caracteres!',
        }),
        zipcode: Joi.string().regex(/^[0-9]+$/).length(8).messages({
            'number.integer': 'CEP deve ser um número inteiro!',
            'number.min': 'CEP precisa no mínimo 8 digitos!',
            'number.max': 'CEP precisa no máximo 8 digitos!',
        })
    });
}

module.exports = {
    createValidate,
    updateValidate
};
