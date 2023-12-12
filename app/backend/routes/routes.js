const router = require('express').Router();
const Auth = require('../middleware/Auth');

//
const multer = require('multer');
const multerConfig = require('../config/multer');
const upload = multer(multerConfig);
//

const AddressController = require('../controllers/AddressController');
const BannerController = require('../controllers/BannerController');
const CartController = require('../controllers/CartController');
const ClientController = require('../controllers/ClientController');
const LoginController = require('../controllers/LoginController');
const MaterialController = require('../controllers/MaterialController');
const OrderController = require('../controllers/OrderController');
const ProductController = require('../controllers/ProductController');
const ProductAvaliationController = require('../controllers/ProductAvaliationController');
const SalesmanController = require('../controllers/SalesmanController');
const UserController = require('../controllers/UserController');

// -> Login
router.post('/login', LoginController.login);
router.get('/me', Auth.auth, LoginController.getUserInfo);

// -> User routes
router.get('/user/all', Auth.auth, Auth.allowAdmin, UserController.index);
router.get('/user/:id', Auth.auth, Auth.allowOnlyOwnedUser, UserController.show);
router.put('/user', Auth.auth, UserController.update);
router.delete('/user/:id', Auth.auth, Auth.allowAdmin, UserController.delete
);

// -> Client routes
router.get('/client/all', Auth.auth, Auth.allowAdmin, ClientController.index);
router.get('/client/:id', Auth.auth, Auth.allowOnlyOwnedClient, ClientController.show);
router.post('/client', ClientController.create);
router.put('/client', Auth.auth, Auth.allowOnlyOwnedClient, ClientController.update);
router.delete('/client/:id', Auth.auth, Auth.allowAdmin, ClientController.delete);

// -> Salesman routes
router.get('/salesman/all', Auth.auth, Auth.allowAdmin, SalesmanController.index)
router.get('/salesman/all/message/:id', Auth.auth, Auth.allowOnlyOwnedSalesman, SalesmanController.indexMessage);
router.get('/salesman/:id', SalesmanController.show)
router.get('/salesman/product/:id', Auth.auth, Auth.allowOnlyOwnedSalesman, SalesmanController.indexSalesmanProducts);
router.post('/salesman', SalesmanController.create)
router.put('/salesman', Auth.auth, Auth.allowOnlyOwnedSalesman, SalesmanController.update)
router.delete('/salesman/:id', Auth.auth, Auth.allowAdmin, SalesmanController.delete)

// -> Cart routes
router.get('/cart/:id_item', Auth.auth, Auth.allowClientAndAdmin, CartController.show);
router.get('/cart/quantity/:id', Auth.auth, Auth.allowOnlyOwnedUser, CartController.quantity);
router.get('/cart/all/:id', Auth.auth, Auth.allowOnlyOwnedUser, CartController.index);
router.post('/cart', Auth.auth, Auth.allowOnlyOwnedUser, CartController.create);
router.put('/cart', Auth.auth, Auth.allowClientAndAdmin, CartController.update);
router.delete('/cart/:id_item', Auth.auth, CartController.delete);

// -> Banner routes
router.get('/banner/all', BannerController.index);
router.post('/banner', Auth.auth, Auth.allowAdmin, BannerController.create);
router.put('/banner', Auth.auth, Auth.allowAdmin, BannerController.update);
router.delete('/banner/:id', Auth.auth, Auth.allowAdmin, BannerController.delete);

// -> Material routes
router.get('/material/all', MaterialController.index);
router.get('/material/mosted/used', MaterialController.indexMostedUsed);
router.get('/material/:id', MaterialController.show);
router.post('/material', Auth.auth, Auth.allowSalesmanAndAdmin, MaterialController.create);
router.put('/material', Auth.auth, Auth.allowAdmin, MaterialController.update);
router.delete('/material/:id', Auth.auth, Auth.allowAdmin, MaterialController.delete);

// -> Address routes
router.get('/address/all/:id', Auth.auth, Auth.allowOnlyOwnedUser, AddressController.index);
router.get('/address/:id', Auth.auth, AddressController.show);
router.get('/address/user/:id', Auth.auth, Auth.allowOnlyOwnedUser, AddressController.showUserAddress);
router.post('/address', Auth.auth, Auth.allowOnlyOwnedUser, AddressController.create);
router.put('/address', Auth.auth, AddressController.update);
router.delete('/address/:id', Auth.auth, Auth.allowClientAndAdmin, AddressController.delete);

// -> Product Avaliation routes
router.get('/avaliation/product/order/:id_order', Auth.auth, ProductAvaliationController.indexByOrder);
router.get('/avaliation/product/client/:id', Auth.auth, Auth.allowOnlyOwnedClient, ProductAvaliationController.indexByClient);
router.get('/avaliation/product/product/:id_product', ProductAvaliationController.indexByProduct);
router.get('/avaliation/product/relation/', Auth.auth, Auth.allowSalesmanAndAdmin, ProductAvaliationController.likeRelation);
router.get('/avaliation/product/:id', ProductAvaliationController.show);
router.post('/avaliation/product', Auth.auth, Auth.allowClientAndAdmin, ProductAvaliationController.create);
router.delete('/avaliation/product/:id', Auth.auth, Auth.allowClientAndAdmin, ProductAvaliationController.delete);
router.delete('/avaliation/product/:id', Auth.auth, Auth.allowClientAndAdmin, ProductAvaliationController.delete);

// -> Order routes
router.get('/order/all/client/:id', Auth.auth, Auth.allowOnlyOwnedClient, OrderController.indexOrderClient);
router.get('/order/all/salesman/:id', Auth.auth, Auth.allowOnlyOwnedSalesman, OrderController.indexOrderSalesman);
router.get('/order/sold', Auth.auth, Auth.allowAdmin, OrderController.quantitySold);
router.get('/order/ship/status', OrderController.statusOrderProducts);
router.get('/order/all', Auth.auth, Auth.allowAdmin, OrderController.index);
router.get('/order/:id', Auth.auth, OrderController.show);
router.post('/order', Auth.auth, Auth.allowOnlyOwnedClient, Auth.allowOnlyOwnedUser, OrderController.create);

// -> Product routes
router.get('/product/all', ProductController.index);
router.get('/product/search', ProductController.search);
router.get('/product/material/:id_material', ProductController.indexByMaterial);
router.get('/product/available', Auth.auth, Auth.allowSalesmanAndAdmin, ProductController.quantityProduct);
router.get('/product/amount_sold/:id', Auth.auth, Auth.allowOnlyOwnedSalesman, OrderController.amountProduct);
router.get('/product/:id', ProductController.show);
router.get('/product/salesman/:id', ProductController.indexBySalesman);
router.get('/product/quantity', ProductController.quantityProduct);
router.get('/product/visualization', ProductController.quantityVisualization);
router.post('/product', Auth.auth, Auth.allowSalesmanAndAdmin, upload.array('file', 15), ProductController.createNew);
router.post('/product/active', Auth.auth, Auth.allowSalesmanAndAdmin, ProductController.updateActivity);
router.put('/product', Auth.auth, Auth.allowSalesmanAndAdmin, ProductController.update);
router.delete('/product/:id', Auth.auth, Auth.allowSalesmanAndAdmin, ProductController.delete);


// Erro 404
router.get('/bermuda_triangle', (req, res) => {
    res.status(404).send({ success: false, message: 'Você não deveria estar aqui...(ಠ_ಠ)' });
});

router.get('*', (req, res) => {
    res.redirect('/bermuda_triangle');
});

module.exports = router;
