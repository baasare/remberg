const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productSchema = new Schema({
    name: {
        type: String
    },
    company: {
        type: String
    },
}, {
    collection: 'products',
    timestamps: true
})

module.exports = mongoose.model('ProductSchema', productSchema)