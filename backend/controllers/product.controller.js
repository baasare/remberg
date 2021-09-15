const db = require("../models");
const {getPagination} = require("../utils/utils");
const Product = db.products;


// get all Products
exports.getProducts = async (req, res) => {

    try {
        const products = await Product.find()
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }

}

// Get a Product
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(404).json({message: error.message});
    }

}