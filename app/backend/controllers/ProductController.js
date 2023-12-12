const Product = require('../models/Product');
const Material = require('../models/Material');
const User = require('../models/User');
const Salesman = require('../models/Salesman');

const ProductSchema = require('../schemas/ProductSchema');

const aws = require('aws-sdk');
const s3 = new aws.S3();

const multerConfig = require('../config/multer');
const multer = require('multer');

const CEPConversor = require('../utils/CEPConversor');

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const Message = require('../utils/Message');

function deleteImages(product_images) {
    const images = product_images.map(p => {
        return { Key: p.key }
    });
    if (process.env.STORAGE_TYPE === 's3') {
        s3.deleteObjects({
            Bucket: process.env.BUCKET_NAME,
            Delete: { Objects: images }
        }, (error, data) => {
            if (error) Message.error(error);

            else Message.info('Deletado com sucesso!', data);
        });
    } else {
        try {
            for (img of images) {
                promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', img.Key));
            }
        } catch (error) {
            Message.warning(error);
        }
    }
}

class ProductController {

    static async quantityProduct(req, res) {
        const id_salesman = req.query.id_salesman;
        if((req.locals.type === 'V' && !id_salesman) || req.locals.type === 'C')
            return res.status(401).send({ success: false, message: 'Você não tem autorização!' });
        let result;

        if (id_salesman) {
            if (isNaN(parseInt(id_salesman)))
                return res.status(400).send({ success: false, message: 'Id de vendedor inválido!' });
            if(id_salesman != req.locals.id_salesman) 
            return res.status(401).send({ success: false, message: 'Você não tem autorização!' });
            result = await Product.countProducts(id_salesman);
        } else result = await Product.countProducts();

        return result.success ? res.send(result) : res.status(400).send(result);
    }

    static async quantityVisualization(req, res) {
        const id_salesman = req.query.id_salesman;
        if((req.locals.type == 'V' && !id_salesman) || req.locals.type === 'C')
            return res.status(401).send({ success: false, message: 'Você não tem autorização!' });
        let result;

        if (id_salesman) {
            if (isNaN(parseInt(id_salesman)))
                return res.status(400).send({ success: false, message: 'Id de vendedor inválido!' });
            if(id_salesman != req.locals.id_salesman) 
            return res.status(401).send({ success: false, message: 'Você não tem autorização!' });
            result = await Product.countVisualizations(id_salesman);
        } else result = await Product.countVisualizations();

        return result.success ? res.send(result) : res.status(400).send(result);
    }

    static async index(req, res) {
        let page = req.query.page;

        if (isNaN(parseInt(page))) page = '1';

        const product = await Product.findAll(page);
        return product.success ? res.send(product) : res.status(404).send(product);
    }

    static async indexBySalesman(req, res) {
        const id_salesman = req.params.id;

        if (isNaN(parseInt(id_salesman)))
            return res.status(404).send({ success: false, message: 'id de vendedor inválido!' });

        let page = req.query.page;
        if (isNaN(parseInt(page))) page = '1';

        const product = await Product.findAllSalesmanProducts(id_salesman, page);
        return product.success ? res.send(product) : res.status(404).send(product);
    }

    static async show(req, res) {
        const id = req.params.id;

        if (isNaN(parseInt(id)))
            return res.status(404).send({ success: false, message: 'id do produto inválido!' });

        let product;
        if(req.query.method === 'ignore')
            product = await Product.findOne(id, true);
        
        else product = await Product.findOne(id);
        

        return product.success ? res.send(product) : res.status(404).send(product);
    }

    static async indexByMaterial(req, res) {
        let page = req.query.page;
        if (isNaN(parseInt(page))) page = '1';

        const id_material = req.params.id_material;
        if (isNaN(parseInt(page))) return res.status(400).send({ success: false, message: 'Id do material inválido!' });

        const product = await Product.findByMaterial(id_material, page);
        return product.success ? res.send(product) : res.status(404).send(product);
    }

    static async search(req, res) {
        const { min_price, max_price, min_avaliation, max_avaliation, cep } = req.query;
        let { search } = req.query;

        if (search) search = search.toString();
        else return res.status(400).send({ success: false, message: 'É necessário informar uma sentença!' });

        const filter = {};

        search = search.replace(/[+]/gi, ' ');
        search = search.replace(/[`~!@#$%^&*()_+|\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

        if (search) {

            filter.search = search;

            if (min_price && !isNaN(parseInt(min_price)) && min_price >= 0) filter.minPrice = min_price;

            if (max_price && !isNaN(parseInt(max_price)) && max_price > 0) filter.maxPrice = max_price;

            if (min_avaliation && !isNaN(parseInt(min_avaliation)) &&
                (min_avaliation >= 0 && min_avaliation <= 100)) filter.minAvaliation = min_avaliation;

            if (max_avaliation && !isNaN(parseInt(max_avaliation)) &&
                (max_avaliation >= 0 && max_avaliation <= 100)) filter.minAvaliation = max_avaliation;

            if (cep) filter.state = CEPConversor.getStateByCEP(cep);
            else filter.state = null;
        }

        let page = req.query.page;
        if (isNaN(parseInt(page))) page = '1';

        const result = await Product.findRelationable(filter, page);
        return result.success ? res.send(result) : res.status(400).send(result);
    }

    static async createNew(req, res) {

        const product_img = [];

        if (!req.files.length)
            return res.status(400).send({ success: false, message: 'As imagens não foram carregadas!' });

        const schema = ProductSchema.createValidate();
        const { error } = schema.validate(req.body);

        for (let file of req.files) {
            const { originalname: name, size, key, location: url = '' } = file;
            product_img.push({ name, size, key, url });
        }

        if (error) {
            deleteImages(product_img);
            return res.status(400).send({ success: false, message: error.details[0].message });
        }

        if (req.body.id_salesman !== req.locals.id_salesman.toString()) {
            deleteImages(product_img);
            return res.status(401).send({ success: false, message: 'Acesso não autorizado!!' });
        }

        if (!salesman.salesman.id_address) {
            deleteImages(product_img);
            return res.status(409).send({ success: false, message: 'Você deve cadastrar um endereço antes!' });
        }


        const existTitle = await Product.findByTitleAndSalesman(req.body.title, req.body.id_salesman)
        if (existTitle.success && Object.keys(existTitle.product).length) {
            this.deleteImages(product_img);
            return res.status(409).send({ success: false, message: 'Título já cadastrado em sua loja!' });
        }

        req.body.key_image = product_img[0].key;
        req.body.url_image = product_img[0].url;

        req.body.price_total = req.body.price;

        const result = await Product.create(req.body, product_img);
        if (result.success) return res.status(201).send(result);

        deleteImages(product_img);
        res.status(400).send(result);
    }

    static async updateActivity(req, res) {
        const { is_active, id_product } = req.body;

        const product = await Product.findOne(id_product);
        if (!product.success) return res.status(400).send(product);

        if (product.product.id_salesman != req.locals.id_salesman)
            return res.status(401).send({ success: false, message: 'Você não tem autorização!' });

        const result = await Product.updateActivity(id_product, is_active);
        return result.success ? res.send(result) : res.status(400).send(result);
    }

    static async update(req, res) {
        const upload = multer(multerConfig).array('file', 5);

        let product_img = [];
        let toUpdate = {};
        upload(req, res, async (fail) => {

            if (fail instanceof multer.MulterError)
                return res.status(400).send({ success: false, message: 'Houve um erro no processamento das imagens!' });

            req.body.data = JSON.parse(req.body.data);
            let { title, id_material, description, price, quantity, is_active, id_product, delete_image } = req.body.data;

            const schema = ProductSchema.updateValidate();
            const { error } = schema.validate(req.body.data);

            if (error)
                return res.status(400).send({ success: false, message: error.details[0].message });

            const product = await Product.findOne(id_product);

            if (product.success && product.product.id_salesman !== req.locals.id_salesman)
                return res.status(400).send({ success: false, message: 'Acesso não autorizado!' });

            if (product.success) {
                if (title && product.product.title !== title) {
                    const existTitle = await Product.findByTitleAndSalesman(title, product.product.id_salesman)

                    if (existTitle.success && Object.keys(existTitle.product).length)
                        return res.status(409).send({ success: false, message: 'Título já cadastrado em sua loja!' });
                    else toUpdate['title'] = title;
                }
            }

            if (is_active && (product.product.quantity == 0 && !quantity) || is_active && !quantity)
                return res.status(409).send({ success: false, message: 'Você não pode ativar um produto com 0 unidades!' });

            if (description && description !== product.product.description) toUpdate['description'] = description;
            if (price && price !== product.product.price) toUpdate['price'] = price;
            if (quantity && quantity !== product.product.quantity) toUpdate['quantity'] = quantity;
            if (is_active && is_active !== product.product.is_active) toUpdate['is_active'] = is_active;
            

            if (id_material && id_material !== product.product.id_material) {
                const existsMaterial = await Material.findOne(id_material);
                if (existsMaterial.success && Object.keys(existsMaterial.material).length) toUpdate['id_material'] = id_material;
                else return res.status(400).send({ success: false, message: 'Material não existe!' });
            }

            let delete_img = [];
            let delete_cover = false;
            if (delete_image && delete_image.length)
                for (let i of delete_image) {
                    delete_img.push({ key: i })
                    if (product.product.key_image == i) delete_cover = true;
                };

            for (let file of req.files) {
                const { originalname: name, size, key, location: url = '' } = file;
                product_img.push({ name, size, key, url });
            }

            if (product.product.images.length + product_img.length - delete_img.length > 5 ||
                product.product.images.length + product_img.length - delete_img.length < 1)
                return res.status(400).send({ success: false, message: 'Você não pode adicionar mais de 5 ou remover todas as imagens do anúncio!' });

            price = price || product.product.price;

            toUpdate['price_total'] = price.toFixed(2);

            const result = await Product.update(id_product, toUpdate, product_img, delete_img, delete_cover);
            if (result.success) {
                if (delete_img.length)
                    deleteImages(delete_img);

                return res.send(result);
            } else return res.status(404).send(result);
        });
    }

    static async delete(req, res) {
        try {
            const id = req.params.id;

            if (isNaN(parseInt(id)))
                return res.status(400).send({ success: false, message: 'Id do produto inválido!' });

            const product = await Product.findOne(id);
            if (!product.success)
                return res.status(404).send(product);

            if (product.success && product.product.id_salesman !== req.locals.id_salesman && req.locals.type !== 'V')
                return res.status(400).send({ success: false, message: 'Você não tem autorização para alterar este produto!' });

            const product_img = await Product.findAllImagesProduct(id);

            if (product_img.success) {
                let id_image = null;
                const keysToDel = [];

                for (let i = 0; i < product_img.images.length; i++) {
                    if (product_img.images[i].key === product.product.key_image) id_image = product_img.images[i].id;
                    else keysToDel.push({ key: product_img.images[i].key });
                }

                const result = await Product.delete(product.product.id, id_image);
                if (!result.success)
                    return res.status(404).send(result);


                if (keysToDel.length) deleteImages(product_img.images);

                return res.send(result);

            } else return res.status(400).send(product_img);
        } catch (error) {
            Message.error(error);
            return res.status(400).send({ 'success': false, message: '' });
        }
    }
}

module.exports = ProductController;