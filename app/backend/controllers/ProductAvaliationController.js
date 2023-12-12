const ProductAvaliation = require('../models/ProductAvaliation');
const Order = require('../models/Order');
const OrderProduct = require('../models/OrderProduct');

const ProductAvaliationSchema = require('../schemas/ProductAvaliationSchema');

class ProductAvaliationController {

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
                
            result = await ProductAvaliation.likeRelation(id_salesman);
        } else result = await ProductAvaliation.likeRelation();

        return result.success ? res.send(result) : res.status(400).send(result);
    }

    static async show(req, res) {
        const id = req.params.id;

        if (isNaN(parseInt(id)))
            return res.status(400).send({ success: false, message: 'Id de avaliação de produto inválido!' });

        const avaliation = await ProductAvaliation.findOne(id);
        return avaliation.success ? res.send(avaliation) : res.status(404).send(avaliation);
    }

    static async indexByOrder(req, res) { 
        const id_order = req.params.id_order;

        if (isNaN(parseInt(id_order)))
            return res.status(400).send({ success: false, message: 'Id de compra de produto inválido!' });

        let page = req.query.page;
        if (isNaN(parseInt(page))) page = '1';

        const order = await Order.findOne(id_order);
        if(!order.success) 
            return res.status(400).send(order);

        if(req.locals.type == 'V' || req.locals.id_client != order.order.id_client) 
            return res.status(401).send({success: false, message: 'Acesso não autorizado!'});

        const avaliation = await ProductAvaliation.findAllByOrder(id_order, page);
        return avaliation.success ? res.send(avaliation) : res.status(404).send(avaliation);
    }

    static async indexByClient(req, res) {
        const id_client = req.params.id;

        if (isNaN(parseInt(id_client)))
            return res.status(400).send({ success: false, message: 'Id de cliente de produto inválido!' });

        let page = req.query.page;

        if (isNaN(parseInt(page))) page = '1';

        const avaliation = await ProductAvaliation.findAllByClient(id_client, page);
        return avaliation.success ? res.send(avaliation) : res.status(404).send(avaliation);
    }

    static async indexByProduct(req, res) {
        const id_product = req.params.id_product;

        if (isNaN(parseInt(id_product)))
            return res.status(400).send({ success: false, message: 'Id de cliente de produto inválido!' });

        let page = req.query.page;

        if (isNaN(parseInt(page))) page = '1';

        const avaliation = await ProductAvaliation.findAllByProduct(id_product, page);
        return avaliation.success ? res.send(avaliation) : res.status(404).send(avaliation);
    }

    static async create(req, res) {
        const schema = ProductAvaliationSchema.createValidate();
        const { error } = schema.validate(req.body);

        if (error)
            return res.status(400).send({ success: false, message: error.details[0].message });

        const { id_order, id_order_product, liked, comment } = req.body;

        const existOrder = await Order.findOne(id_order);
        if (!existOrder.success)
            return res.status(404).send(existOrder);

        if(existOrder.order.id_client != req.locals.id_client)  
            return res.status(404).send({ success: false, message: 'Acesso não autorizado!'});

        const existOrderProduct = await OrderProduct.findOne(id_order_product);
        if (!existOrderProduct.success)
            return res.status(404).send(existOrder);

        if (existOrderProduct.order_product.status !== 'R')
            return res.status(409).send({ success: false, message: 'A entrega ainda não foi concluída!' });

        const alreadyExistsAvaliation = await ProductAvaliation.findByOrderAndOrderProduct(id_order, id_order_product);
        if (alreadyExistsAvaliation.success)
            return res.status(409).send({ success: false, message: 'Já existe uma avaliação para este item da compra!' });

        const data = { id_order, id_order_product, liked, id_product: existOrderProduct.order_product.id_product };
        if (comment) data.comment = comment;


        const avaliation = await ProductAvaliation.create(data);
        return avaliation.success ? res.status(201).send(avaliation) : res.status(400).send(avaliation);
    }

    static async delete(req, res) {
        const id = req.params.id;

        if (isNaN(parseInt(id)))
            return res.status(400).send({ success: false, message: 'Id de avaliação de produto inválido!' });

        const existAvaliation = await ProductAvaliation.findOne(id);
        if (!existAvaliation.success)
            return res.status(404).send(existAvaliation);

        const order = await Order.findOne(existAvaliation.avaliation.id_order);

        if(!order.success) 
            return res.status(400).send(order);
        if(order.order.id_client != req.locals.id_client) 
            return res.status(401).send({success: false, message: 'Acesso não autorizado!'});

        const result = await ProductAvaliation.delete(id);
        return result.success ? res.send(result) : res.status(400).send(result);
    }
};

module.exports = ProductAvaliationController;
