const Banner = require('../models/Banner');
const BannerSchema = require('../schemas/BannerSchema');

const aws = require('aws-sdk');
const s3 = new aws.S3();

const multerConfig = require('../config/multer');
const multer = require('multer');

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

            else Message.info('Delete', data);
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

class BannerController{
    static async index(req, res){
        const result = await Banner.findAll();
        return result.success ? res.send(result) : res.status(400).send(result);
    }

    static async create(req, res){
        const upload = multer(multerConfig).single('file');
        const banner_img = [];

        upload(req, res, async(fail) => {
            if (!req.file)
                return res.status(400).send({ success: false, message: 'A imagem não foi carregada!' });

            if (fail instanceof multer.MulterError)
                return res.status(400).send({ success: false, message: 'Houve um erro no processamento da imagem!' });

            req.body.data = JSON.parse(req.body.data);

            const schema = BannerSchema.createValidate();
            const { error } = schema.validate(req.body.data);

            const { originalname: name, size, key, location: url = '' } = req.file;
            banner_img.push({ name, size, key, url });

            if (error) {
                deleteImages(banner_img);
                return res.status(400).send({ success: false, message: error.details[0].message });
            }

            req.body.data.key_image = banner_img[0].key;
            req.body.data.url_image = banner_img[0].url;

            const result = await Banner.create(req.body.data);
            if (result.success) return res.status(201).send(result);

            deleteImages(product_img);
            return res.status(400).send(result);
        });
    }

    static async update(req, res){
        const schema = BannerSchema.updateValidate();
            const { error } = schema.validate(req.body);

            if (error) 
                return res.status(400).send({ success: false, message: error.details[0].message });

            const existsBanner = await Banner.findOne(req.body.id_banner);
            if(!existsBanner.success || !existsBanner.banner)
                return res.status(400).send({ success: false, message: 'Id de banner inválido'});

            const result = await Banner.update(req.body.id_banner, {link: req.body.link});
            if (result.success) return res.status(201).send(result);
            return res.status(400).send(result);
    }

    static async delete(req, res){
        const id_banner = req.params.id;
        
        const existsBanner = await Banner.findOne(id_banner);
            if(!existsBanner.success || !existsBanner.banner)
                return res.status(400).send({ success: false, message: 'Id de banner inválido'});

        const result = await Banner.delete(id_banner);
        if(result.success) deleteImages([{key: existsBanner.banner.key_image}]);
        return result.success ? res.send(result) : res.status(400).send(result);
    }
}

module.exports = BannerController;