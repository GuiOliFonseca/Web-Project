const router = require('express').Router();
const Auth = require('../middleware/Auth');

//
const multer = require('multer');
const multerConfig = require('../config/multer');
const upload = multer(multerConfig);
//

const AddressController = require('../controllers/AddressController');
const CartController = require('../controllers/CartController');
const ClientController = require('../controllers/ClientController');
const LoginController = require('../controllers/LoginController');
const CategoryController = require('../controllers/CategoryController');
const OrderController = require('../controllers/OrderController');
const ProductController = require('../controllers/ProductController');
const ProductAvaliationController = require('../controllers/ProductAvaliationController');
const SalesmanController = require('../controllers/SalesmanController');
const UserController = require('../controllers/UserController');

// -> Login
router.post('/login', LoginController.login);
router.get('/me', Auth.auth, LoginController.getUserInfo);

// -> User routes
router.get('/user/all', Auth.auth, UserController.index);
router.get('/user/:id', Auth.auth, UserController.show);
router.put('/user', Auth.auth, UserController.update);
router.delete('/user/:id', Auth.auth, UserController.delete);

// -> Client routes
router.get('/client/all', Auth.auth, ClientController.index);
router.get('/client/:id', Auth.auth, ClientController.show);
router.post('/client', ClientController.create);
router.put('/client', Auth.auth, ClientController.update);
router.delete('/client/:id', Auth.auth, ClientController.delete);

// -> Salesman routes
router.get('/salesman/all', Auth.auth, SalesmanController.index);
router.get('/salesman/:id', SalesmanController.show)
router.get('/salesman/product/:id', Auth.auth, SalesmanController.indexSalesmanProducts);
router.post('/salesman', SalesmanController.create)
router.put('/salesman', Auth.auth, SalesmanController.update)
router.delete('/salesman/:id', Auth.auth, SalesmanController.delete)

// -> Cart routes
router.get('/cart/:id_item', Auth.auth, CartController.show);
router.get('/cart/quantity/:id', Auth.auth, CartController.quantity);
router.get('/cart/all/:id', Auth.auth, CartController.index);
router.post('/cart', Auth.auth, CartController.create);
router.put('/cart', Auth.auth, CartController.update);
router.delete('/cart/:id_item', Auth.auth, CartController.delete);

// -> Category routes
router.get('/category/all', CategoryController.index);
router.get('/category/mosted/used', CategoryController.indexMostedUsed);
router.get('/category/:id', CategoryController.show);

// -> Address routes
router.get('/address/all/:id', Auth.auth, AddressController.index);
router.get('/address/:id', Auth.auth, AddressController.show);
router.get('/address/user/:id', Auth.auth, AddressController.showUserAddress);
router.post('/address', Auth.auth, AddressController.create);
router.put('/address', Auth.auth, AddressController.update);
router.delete('/address/:id', Auth.auth, AddressController.delete);

// -> Product Avaliation routes
router.get('/avaliation/product/order/:id_order', Auth.auth, ProductAvaliationController.indexByOrder);
router.get('/avaliation/product/client/:id', Auth.auth, ProductAvaliationController.indexByClient);
router.get('/avaliation/product/product/:id_product', ProductAvaliationController.indexByProduct);
router.get('/avaliation/product/relation/', Auth.auth, ProductAvaliationController.likeRelation);
router.get('/avaliation/product/:id', ProductAvaliationController.show);
router.post('/avaliation/product', Auth.auth, ProductAvaliationController.create);
router.delete('/avaliation/product/:id', Auth.auth, ProductAvaliationController.delete);
router.delete('/avaliation/product/:id', Auth.auth, ProductAvaliationController.delete);

// -> Order routes
router.get('/order/all/client/:id', Auth.auth, OrderController.indexOrderClient);
router.get('/order/all/salesman/:id', Auth.auth, OrderController.indexOrderSalesman);
router.get('/order/sold', Auth.auth, OrderController.quantitySold);
router.get('/order/all', Auth.auth, OrderController.index);
router.get('/order/:id', Auth.auth, OrderController.show);
router.post('/order', Auth.auth, OrderController.create);

// -> Product routes
router.get('/product/all', ProductController.index);
router.get('/product/search', ProductController.search);
router.get('/product/category/:id_category', ProductController.indexByCategory);
router.get('/product/available', Auth.auth, ProductController.quantityProduct);
router.get('/product/amount_sold/:id', Auth.auth, OrderController.amountProduct);
router.get('/product/:id', ProductController.show);
router.get('/product/salesman/:id', ProductController.indexBySalesman);
router.get('/product/quantity', ProductController.quantityProduct);
router.get('/product/visualization', ProductController.quantityVisualization);
router.post('/product', Auth.auth, upload.array('file', 15), ProductController.createNew);
router.post('/product/active', Auth.auth, ProductController.updateActivity);
router.put('/product', Auth.auth, ProductController.update);
router.delete('/product/:id', Auth.auth, ProductController.delete);


// Erro 404
router.get('/bermuda_triangle', (req, res) => {
    res.status(404).send({ success: false, message: 'Você não deveria estar aqui...(ಠ_ಠ)' });
});

router.get('*', (req, res) => {
    res.redirect('/bermuda_triangle');
});

module.exports = router;
