const Joi = require('joi');

const createValidate = () => {
    return Joi.object().keys({
        email: Joi.string().email().min(10).max(150).required().messages({
            'string.email': 'Email inválido!',
            'string.min': 'Email deve ter no mínimo 10 caracteres!',
            'string.max': 'Email deve ter no máximo 150 caracteres!',
            'string.empty': 'Email não pode ser vazio!',
            'any.required': 'Email é obrigatório!'
        }),
    });
}

const changeValidate = async () => {
    return Joi.object().keys({
        password: Joi.string().regex(/^(?!\s)(?!.*\s$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/).min(8).max(30).required().messages({
            'string.pattern.base': 'A senha deve conter pelo menos uma letra minúscula, uma maiúscula, um dígito e um caractere especial!',
            'string.min': 'Senha deve conter no mínimo 8 caracteres!',
            'string.max': 'Senha deve conter no máximo 30 caracteres!',
            'string.empty': 'É necessário informar uma senha!',
            'any.required': 'Senha é obrigatória!'
        })
    });
}

module.exports = {
    createValidate,
    changeValidate
};
