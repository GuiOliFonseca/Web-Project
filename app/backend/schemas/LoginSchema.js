const Joi = require('joi');

const loginValidate = async () => {
    return Joi.object().keys({
        email: Joi.string().email().required().messages({
            'string.email': 'Email inválido!',
            'string.empty': 'Email não pode ser inválido!',
            'string.empty': 'Email não pode ser vazio!',
            'any.required': 'Email é obrigatório!'
        }),
        password: Joi.string().required().messages({
            'string.empty': 'Senha não pode ser vazio!',
            'any.required': 'Senha é obrigatório!'
        })
    })
}

module.exports = {
    loginValidate
};
