require('dotenv').config();

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
const Message = require('../utils/Message');

async function auth(req, res, next) {
    const authToken = req.headers['authorization'];

    if (authToken) {
        const bearer = authToken.split(' ');
        const token = bearer[1] || bearer[0];
        try {
            const decod = jwt.verify(token, secret);
            req.locals = decod;

            return next();
        } catch (error) {
            Message.warning(error);
            return res.status(401).send({ success: false, message: 'Sessão expirada, refaça login!' });
        }
    } else {
        return res.status(401).send({ success: false, message: 'É necessário submeter o token de acesso!' });
    }
};

async function allowClient(req, res, next) {
    return req.locals.type === 'C' ? next() : res.status(401).send({ success: false, message: 'Acesso negado!' });
}

async function allowSalesman(req, res, next) {
    return req.locals.type === 'V' ? next() : res.status(401).send({ success: false, message: 'Acesso negado!' });
}


// -> Acesso compartilhado por tipo
async function allowClientAndSalesman(req, res, next) {
    return (req.locals.type === 'C' || req.locals.type === 'V') ? next() : res.status(401).send({ success: false, message: 'Acesso negado!' });
}


// -> Acesso por escopo
async function allowOnlyOwnedClient(req, res, next) {
    if (req.locals.type === 'V') return res.status(401).send({ success: false, message: 'Acesso negado!' });

    const id_client = req.locals.id_client;
    if ((req.params.id && (req.params.id != id_client)) || (req.body.id_client && (req.body.id_client != id_client)))
        return res.status(401).send({ success: false, message: 'Acesso negado!' });

    return next();
}

async function allowOnlyOwnedUser(req, res, next) {
    const id_user = req.locals.id_user;
    if ((req.params.id && (req.params.id != id_user)) || (req.body.id_user && (req.body.id_user != id_user)))
        return res.status(401).send({ success: false, message: 'Acesso negado!' });

    return next();
}

async function allowOnlyOwnedSalesman(req, res, next) {
    if (req.locals.type === 'C') return res.status(401).send({ success: false, message: 'Acesso negado!' });

    const id_salesman = req.locals.id_salesman;
    if ((req.params.id && (req.params.id != id_salesman)) || (req.body.id_salesman && (req.body.id_salesman != id_salesman)))
        return res.status(401).send({ success: false, message: 'Acesso negado!' });

    return next();
}

async function allowOnlyOwned(req, res, next) {
    if (req.locals.type === 'V') {
        const id_salesman = req.locals.id_salesman;
        if ((req.params.id && (req.params.id != id_salesman)) || (req.body.id_salesman && (req.body.id_salesman != id_salesman)))
            return res.status(401).send({ success: false, message: 'Acesso negado!' });
    }

    if (req.locals.type === 'C') {
        const id_client = req.locals.id_client;
        if ((req.params.id && (req.params.id != id_client)) || (req.body.id_client && (req.body.id_client != id_client)))
            return res.status(401).send({ success: false, message: 'Acesso negado!' });
    }

    return next();
}

module.exports = {
    auth,
    allowClient,
    allowSalesman,
    allowClientAndSalesman,
    allowOnlyOwnedClient,
    allowOnlyOwnedUser,
    allowOnlyOwned,
    allowOnlyOwnedSalesman
};
