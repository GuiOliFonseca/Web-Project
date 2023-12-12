const cron = require("node-cron");
const Order = require("../models/Order");
const Product = require("../models/Product");
const OrderProduct = require("../models/OrderProduct");

cron.schedule("0 3 * * *", async () => {
    console.log('job inicio')
    const openOrders = await Order.findAllOpenBoletoOrders();
    if(openOrders.success){
        for(let order of openOrders.orders){
            let result = await Order.refuseOrder(order.id, 'refused', 'Boleto venceu');
            if(!result.success) continue;
            const orderProducts = await OrderProduct.findAll(order.id);
            if(orderProducts.success){
                for(let p of orderProducts.order_products){
                    Product.rollback(p.id_product, p.quantity);
                }
            }
        }
    }
    console.log('Job rodou');
});

module.exports = {cron};