const SalesmanAvaliation = require('../models/SalesmanAvaliation');
const Salesman = require('../models/Salesman');
const SalesmanAvaliationSchema = require('../schemas/SalesmanAvaliationSchema');
const OrderProduct = require('../models/OrderProduct');

class SalesmanAvaliationController {
    static async likeRelation(req, res) {
        const id_salesman = req.query.id_salesman;
        if(req.locals.type == 'V' && !id_salesman)
            return res.status(401).send({ success: false, message: 'Você não tem autorização!' });
        let result;

        if (id_salesman) {
            if (isNaN(parseInt(id_salesman))) 
                return res.status(400).send({ success: false, message: 'Id de vendedor inválido!' });
            if(id_salesman != req.locals.id_salesman)
                return res.status(401).send({ success: false, message: 'Você não tem autorização!' });
                
            result = await SalesmanAvaliation.likeRelation(id_salesman);
        } else result = await SalesmanAvaliation.likeRelation();

        return result.success ? res.send(result) : res.status(400).send(result);
    }

    static async index(req, res) {
        const id_salesman = req.params.id;
        if (isNaN(parseInt(id_salesman)))
            return res.status(400).send({ success: false, message: 'Id inválido de avaliação!' });

        let page = req.query.page;
        if (isNaN(parseInt(page))) page = '1';

        const avaliation = await SalesmanAvaliation.findAll(id_salesman, page);
        return avaliation.success ? res.send(avaliation) : res.status(404).send(avaliation);
    }

    static async show(req, res) {
        const id_avaliation = req.params.id;
        if (isNaN(parseInt(id_avaliation)))
            return res.status(400).send({ success: false, message: 'Id inválido de avaliação!' });

        const avaliation = await SalesmanAvaliation.findOne(id_avaliation);
        return avaliation.success ? res.send(avaliation) : res.status(404).send(avaliation);
    }

    static async countAvaliations(req, res) {
        const id_salesman = req.params.id;
        if (isNaN(parseInt(id_salesman)))
            return res.status(400).send({ success: false, message: 'Id inválido de avaliação!' });

        const result = await SalesmanAvaliation.countAvaliations(id_salesman);
        return result.success ? res.send(result) : res.status(404).send(result);
    }

    static async create(req, res) {
        const schema = SalesmanAvaliationSchema.createValidate();
        const { error } = schema.validate(req.body);

        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });


        const { liked, comment, id_order_product, id_client, id_salesman } = req.body;

        let avaliation = {
            liked,
            comment,
            id_order_product,
            id_client,
            id_salesman
        }

        const existSalesman = await Salesman.findOne(id_salesman);
        if (!existSalesman.success)
            return res.status(404).send({ success: false, message: 'Vendedor inexistente!' });

        const existOrderProduct = await OrderProduct.findOne(id_order_product);
        if (!existOrderProduct.success)
            return res.status(404).send({ success: false, message: 'Esse pedido não existe para essa ordem!' });

        if (existOrderProduct.order_product.status !== 'R')
            return res.status(409).send({ success: false, message: 'O pedido deve ser entrege antes de avaliar!' });

        const existSalesmanAvaliation = await SalesmanAvaliation.findByOrderProduct(existOrderProduct.order_product.id_order_product);
        if (existSalesmanAvaliation.success) return res.status(409).send({ success: false, message: 'Você já avaliou o vendedor nesse pedido!' });

        const result = await SalesmanAvaliation.create(avaliation);
        result.success ? res.status(201).send(result) : res.status(400).send(result);
    }

    static async delete(req, res) {
        const id = req.params.id;

        if (isNaN(parseInt(id)))
            return res.status(400).send({ success: false, message: 'Id inválido!' })


        const avaliation = await SalesmanAvaliation.findOne(id);
        if (!avaliation.success)
            return res.status(404).send({ success: false, message: 'Avaliação não existe!' });

        const result = await SalesmanAvaliation.delete(id);
        return result.success ? res.send(result) : res.status(400).send(result);
    }
};

module.exports = SalesmanAvaliationController;
