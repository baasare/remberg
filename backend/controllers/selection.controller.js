const db = require("../models");
const Selection = db.selections;


// get all Selected Products
exports.getSelections = async (req, res) => {
    try {
        const selectedProducts = await Selection.find();
        res.json(selectedProducts);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// Create a Selected Product
exports.saveSelection = async (req, res) => {
    const selection = new Selection(req.body);
    try {
        const savedSelectedProduct = await selection.save();
        res.status(201).json(savedSelectedProduct);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

// Delete a Selected Product
exports.deleteSelection = async (req, res) => {
    const selectedProductId = await Selection.findOne({_id: req.params.id});
    if (!selectedProductId) return res.status(404).json({message: "No Data Found"});
    try {
        const removedSelectedProduct = await Selection.deleteOne({_id: req.params.id});
        res.status(200).json(removedSelectedProduct);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}