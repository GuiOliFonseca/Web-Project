const Joi = require('joi');

const updateValidate = () => {
    return Joi.object().keys({
        name: Joi.string().regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(1).max(50).messages({
            'string.pattern.base': 'Nome deve ter somente letras!',
            'string.min': 'Nome não pode ter menos de 1 caractere!',
            'string.max': 'Nome não pode ter mais de 50 caracteres!',
        }),
        surname: Joi.string().regex(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(1).max(50).messages({
            'string.pattern.base': 'Sobrenome deve ter somente letras!',
            'string.min': 'Sobrenome não pode ter menos de 1 caractere!',
            'string.max': 'Sobrenome não pode ter mais de 50 caracteres!',
        }),
        email: Joi.string().email().messages({
            'string.email': 'Email inválido!'
        }),
        tel: Joi.string().regex(/^[0-9]{10,11}$/).messages({
            'string.pattern.base': 'Telefone deve ter 10-11 caracteres!'
        }),
        id: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id deve ser um interio!',
            'number.min': 'Id não pode ser menor que 1!',
            'number.empty': 'Id não pode ser vazio!',
            'any.required': 'Id é obrigatório!'
        })
    })
}

module.exports = {
    updateValidate
};