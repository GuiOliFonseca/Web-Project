const Joi = require('joi');

/**
 * CÓDIGOS DE TIPO DE CONTA
 * 
 * CCI: Conta Corrente Individual
 * CCJ: Conta Corrente Conjunta
 * CPI: Conta Poupança Individual
 * CPJ: Conta Poupança Conjunta
 */

const createValidate = () => {
    return Joi.object().keys({

        type: Joi.string().regex(/^C*.((PI)|(PJ)|(CI)|(CJ){1})$/).required().messages({
            'string.pattern.base': 'Tipo de conta bancária deve possuir apenas 3 caracteres!',
            'string.empty': 'Tipo de conta bancária não pode ser vazio!',
            'any.required': 'Tipo de conta bancária é obrigatório!'
        }),
        agency: Joi.string().min(1).max(10).required().messages({
            'string.max': 'Agência deve possuir no máximo 10 dígitos!',
            'string.min': 'Agência deve possuir no mínimo 1 dígitos!',
            'string.empty': 'Agência bancária não pode ser vazio!',
            'any.required': 'Agência bancária é obrigatório!'
        }),
        agency_dv: Joi.string().allow('').max(1).messages({
            'string.max': 'Dígito verificador deve possuir no máximo 1 dígitos!',
        }),
        account: Joi.string().min(1).max(20).required().messages({
            'string.max': 'Agência deve possuir no máximo 20 dígitos!',
            'string.min': 'Agência deve possuir no mínimo 1 dígitos!',
            'string.empty': 'Número da conta não pode ser vazio!',
            'any.required': 'Número da conta é obrigatório!'
        }),
        account_dv: Joi.string().min(1).max(2).required().messages({
            'string.max': 'Dígito verificador deve possuir no máximo 2 dígitos!',
            'string.min': 'Dígito verificador deve possuir no mínimo 1 dígito!',
            'string.empty': 'Dígito verificador não pode ser vazio!',
            'any.required': 'Dígito verificador  é obrigatório!'
        }),
        holder: Joi.string().regex(/^(?!\s)(?!.*\s$)[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ. ]+$/).min(1).max(500).required().messages({
            'string.min': 'Titular da conta deve ter no mínimo 1 letra!',
            'string.max': 'Titular da conta deve ter no máximo 100 letras!',
            'string.pattern.base': 'Titular deve conter apenas letras e não pode começar ou terminar com espaços!',
            'string.empty': 'Titular da conta não pode ser vazio!',
            'any.required': 'Titular da conta é obrigatório!'
        }),
        document: Joi.string().required().messages({
            'string.empty': 'Documento não pode ser vazio!',
            'any.required': 'Documento é obrigatório!'
        }),
        id_bank: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id de banco deve ser um inteiro!',
            'number.min': 'Id de banco não pode ser menor que 1!',
            'number.empty': 'Id de banco não pode ser vazio!',
            'any.required': 'Id de banco é obrigatório!'
        }),
        id_salesman: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id de vendedor deve ser um inteiro!',
            'number.min': 'Id de vendedor não pode ser menor que 1!',
            'number.empty': 'Id de vendedor não pode ser vazio!',
            'any.required': 'Id de vendedor é obrigatório!'
        }),
    });
}

const updateValidate = () => {
    return Joi.object().keys({

        type: Joi.string().regex(/^C*.((PI)|(PJ)|(CI)|(CJ){1})$/).required().messages({
            'string.pattern.base': 'Tipo de conta bancária deve possuir apenas 3 caracteres!',
            'string.empty': 'Tipo de conta bancária não pode ser vazio!',
            'any.required': 'Tipo de conta bancária é obrigatório!'
        }),
        agency: Joi.string().min(1).max(10).required().messages({
            'string.required': 'Agência é obrigatório!',
            'string.max': 'Agência deve possuir no máximo 10 dígitos!',
            'string.min': 'Agência deve possuir no mínimo 1 dígitos!',
            'string.empty': 'Agência bancária não pode ser vazio!'
        }),
        agency_dv: Joi.string().allow('').max(1).messages({
            'string.max': 'Dígito verificador deve possuir no máximo 1 dígitos!',
        }),
        account: Joi.string().min(1).max(20).required().messages({
            'string.required': 'Número da conta é obrigatório!',
            'string.max': 'Número da conta deve possuir no máximo 20 digitos!',
            'string.min': 'Número da conta deve possuir no mínimo 1 digito!',
            'string.empty': 'Número da conta não pode ser vazio!'
        }),
        holder: Joi.string().regex(/^(?!\s)(?!.*\s$)[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(1).max(100).required().messages({
            'string.min': 'Titular da conta deve ter no mínimo 1 letra!',
            'string.max': 'Titular da conta deve ter no máximo 100 letras!',
            'string.pattern.base': 'Titular deve conter apenas letras e não pode começar ou terminar com espaços!',
            'string.required': 'Titular da conta é obrigatório!',
            'string.empty': 'Titular da conta não pode ser vazio!',
        }),
        document: Joi.string().required().messages({
            'string.required': 'Documento é obrigatório!',
            'string.empty': 'Documento não pode ser vazio!',
        }),
        account_dv: Joi.string().min(1).max(2).required().messages({
            'string.required': 'Dígito verificador é obrigatório!',
            'string.max': 'Dígito verificador deve possuir no máximo 2 dígitos!',
            'string.min': 'Dígito verificador deve possuir no mínimo 1 dígito!',
            'string.empty': 'Dígito verificador não pode ser vazio!'
        }),
        id_bank: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id de banco deve ser um inteiro!',
            'number.min': 'Id de banco não pode ser menor que 1!',
            'number.empty': 'Id de banco não pode ser vazio!'
        }),
        id_bank_account: Joi.number().integer().min(1).required().messages({
            'number.integer': 'Id de conta bancária deve ser um inteiro!',
            'number.min': 'Id de conta bancária não pode ser menor que 1!',
            'number.empty': 'Id de conta bancária não pode ser vazio!'
        }),
    });
}

module.exports = {
    createValidate,
    updateValidate
};