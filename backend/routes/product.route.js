const products = require("../controllers/product.controller.js");
module.exports = app => {
    const products = require("../controllers/product.controller.js");

    const router = require("express").Router();

    // GET All Products
    router.get('/', products.getProducts);

    // GET Product
    router.get('/:id', products.getProductById);

    app.use('/api/v1/products', router);
}
