const Category = require('../models/Category');

class CategoryController {
    static async index(req, res) {
        const category = await Category.findAll();
        return category.success ? res.send(category) : res.status(404).send(category);
    }

    static async show(req, res) {
        const id = req.params.id;

        if (isNaN(parseInt(id)))
            return res.status(400).send({ success: false, message: 'Id inválido' });


        const category = await Category.findOne(id);
        category.success ? res.send(category) : res.status(404).send(category);
    }

    static async indexMostedUsed(req, res){
        const category = await Category.findMostedUsed();
        category.success ? res.send(category) : res.status(404).send(category);
    }
}

module.exports = CategoryController;